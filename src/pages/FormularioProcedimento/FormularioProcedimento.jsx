import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Pagina from '../../components/Pagina';
import Header from '../../components/Header';
import Botao from '../../components/Botao';
import CampoFormulario from '../../components/CampoFormulario';
import CampoInput from '../../components/CampoInput';
import CampoTexto from '../../components/CampoTexto';
import MensagemEstado from '../../components/MensagemEstado';
import {
    Formulario,
    CamposFormulario,
    AcoesFormulario,
} from '../../components/Formulario';
import CampoSelect from '../../components/CampoSelect';

import {
    listar,
    buscarPorId,
    criar,
    atualizar,
} from '../../services/procedimentoService';

const dadosVazios = {
    nome: '',
    descricao: '',
    tipoProcedimento: '',
    valor: '',
};

export default function FormularioProcedimento() {
    const { id } = useParams();
    const navigate = useNavigate();
    const editando = Boolean(id);

    const [dados, setDados] = useState(dadosVazios);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState('');
    const [erroCarregamento, setErroCarregamento] = useState('');
    const [tiposProcedimento, setTiposProcedimento] = useState([]);

    useEffect(() => {
        let ativo = true;

        setErro('');
        setErroCarregamento('');
        setDados(dadosVazios);
        setTiposProcedimento([]);
        setCarregando(true);

        async function carregarDados() {
            try {
                const procedimentos = await listar();

                const tipos = procedimentos
                    .map((procedimento) => procedimento.tipoProcedimento)
                    .filter(
                        (tipo, indice, lista) =>
                            typeof tipo === 'string' &&
                            tipo.trim() !== '' &&
                            lista.indexOf(tipo) === indice,
                    );

                if (tipos.length === 0) {
                    throw new Error('Nenhum tipo de procedimento disponível no banco.');
                }

                if (ativo) {
                    setTiposProcedimento(tipos);
                }

                if (id) {
                    const procedimento = await buscarPorId(id);

                    if (ativo) {
                        setDados({
                            nome: procedimento.nome ?? '',
                            descricao: procedimento.descricao ?? '',
                            tipoProcedimento: procedimento.tipoProcedimento ?? '',
                            valor: String(procedimento.valor ?? ''),
                        });
                    }
                }
            } catch (error) {
                if (ativo) {
                    setErroCarregamento(
                        error.response?.data?.mensagem ||
                        error.response?.data?.error ||
                        error.response?.data?.message ||
                        error.message ||
                        'Não foi possível carregar os dados do formulário.',
                    );
                }
            } finally {
                if (ativo) {
                    setCarregando(false);
                }
            }
        }

        carregarDados();

        return () => {
            ativo = false;
        };
    }, [id]);

    function alterarCampo(event) {
        const { name, value } = event.target;
        setDados((anteriores) => ({ ...anteriores, [name]: value }));
    }

    function normalizarNome(nome) {
        return String(nome ?? '')
            .trim()
            .replace(/\s+/g, ' ')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    }

    async function enviar(event) {
        event.preventDefault();
        if (salvando || carregando || erroCarregamento) return;

        setErro('');
        const nome = dados.nome.trim();
        const descricao = dados.descricao.trim();
        const tipoProcedimento = dados.tipoProcedimento.trim();
        const valorPreenchido = String(dados.valor).trim();
        const valor = Number(valorPreenchido);

        if (!nome || !descricao || !tipoProcedimento) {
            setErro('Preencha nome, descrição e tipo do procedimento.');
            return;
        }

        if (valorPreenchido === '' || !Number.isFinite(valor) || valor < 0) {
            setErro('Informe um valor válido, maior ou igual a zero.');
            return;
        }

        setSalvando(true);
        try {
            const procedimentos = await listar();
            const duplicados = procedimentos.filter(
                (procedimento) =>
                    procedimento._id !== id &&
                    normalizarNome(procedimento.nome) === normalizarNome(nome),
            );

            if (duplicados.length > 0) {
                setErro('Já existe um procedimento cadastrado com esse nome.');
                return;
            }

            const procedimento = { nome, descricao, tipoProcedimento, valor };
            if (editando) {
                await atualizar(id, procedimento);
            } else {
                await criar(procedimento);
            }
            navigate('/procedimentos');
        } catch (error) {
            setErro(
                error.response?.data?.mensagem ||
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Não foi possível concluir o salvamento. Verifique a conexão e tente novamente.',
            );
        } finally {
            setSalvando(false);
        }
    }

    const opcoesTipoProcedimento = [
            { valor: '', rotulo: 'Selecione um tipo' },
            ...tiposProcedimento.map((tipo) => {
                const texto = tipo.trim().toLocaleLowerCase('pt-BR');

                return {
                    valor: tipo,
                    rotulo: texto.charAt(0).toLocaleUpperCase('pt-BR') + texto.slice(1),
                };
            }),
        ];

    return (
        <Pagina>
            <Header
                titulo={
                    editando ? 'Editar procedimento' : 'Cadastrar procedimento'
                }
                descricao={
                    editando
                        ? 'Atualize os dados do procedimento selecionado.'
                        : 'Preencha os dados para cadastrar um novo procedimento.'
                }
            />

            {carregando ? (
                <MensagemEstado>Carregando procedimento…</MensagemEstado>
            ) : erroCarregamento ? (
                <MensagemEstado
                    tipo="erro"
                    acao={
                        <Botao onClick={() => navigate('/procedimentos')}>
                            Voltar para procedimentos
                        </Botao>
                    }
                >
                    {erroCarregamento}
                </MensagemEstado>
            ) : (
                <Formulario onSubmit={enviar}>
                    {erro && (
                        <MensagemEstado tipo="erro">{erro}</MensagemEstado>
                    )}

                    <CamposFormulario>
                        <CampoFormulario rotulo="Nome do procedimento" largo>
                            <CampoInput
                                type="text"
                                name="nome"
                                value={dados.nome}
                                onChange={alterarCampo}
                                placeholder="Ex.: Restauração"
                                required
                                disabled={salvando}
                            />
                        </CampoFormulario>

                        <CampoFormulario rotulo="Tipo do procedimento">
                            <CampoSelect
                                name="tipoProcedimento"
                                value={dados.tipoProcedimento}
                                onChange={alterarCampo}
                                options={opcoesTipoProcedimento}
                                required
                                disabled={salvando}
                            />
                        </CampoFormulario>

                        <CampoFormulario rotulo="Valor (R$)">
                            <CampoInput
                                type="number"
                                name="valor"
                                value={dados.valor}
                                onChange={alterarCampo}
                                min="0"
                                step="0.01"
                                placeholder="0,00"
                                required
                                disabled={salvando}
                            />
                        </CampoFormulario>

                        <CampoFormulario rotulo="Descrição" largo>
                            <CampoTexto
                                name="descricao"
                                value={dados.descricao}
                                onChange={alterarCampo}
                                rows={4}
                                placeholder="Descreva o procedimento"
                                required
                                disabled={salvando}
                            />
                        </CampoFormulario>
                    </CamposFormulario>

                    <AcoesFormulario>
                        <Botao
                            variante="secundario"
                            onClick={() => navigate('/procedimentos')}
                            disabled={salvando}
                        >
                            Cancelar
                        </Botao>

                        <Botao type="submit" disabled={salvando}>
                            {salvando
                                ? 'Salvando…'
                                : editando
                                    ? 'Salvar alterações'
                                    : 'Cadastrar procedimento'}
                        </Botao>
                    </AcoesFormulario>
                </Formulario>
            )}
        </Pagina>
    );
}
