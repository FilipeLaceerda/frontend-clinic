import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Botao from '../../components/Botao';
import CampoFormulario from '../../components/CampoFormulario';
import CampoInput from '../../components/CampoInput';
import CampoSelect from '../../components/CampoSelect';
import CampoTexto from '../../components/CampoTexto';
import { AcoesFormulario, CamposFormulario, Formulario } from '../../components/Formulario';
import Header from '../../components/Header';
import MensagemEstado from '../../components/MensagemEstado';
import Pagina from '../../components/Pagina';
import {
  atualizar,
  buscarPorId,
  criar,
} from '../../services/atendimentoService';
import './FormularioAtendimento.css';

const vazio = {
  idAtendimento: '',
  observacao: '',
  data: '',
  valorTotal: '',
  tipoAtendimento: 'CLÍNICO',
  parcelas: '1',
  fk_CPF_Paciente: '',
  fk_CPF_Secretaria: '',
  status: 'AGENDADO',
  horario_inicio: '',
  horario_fim: '',
};

function mensagemErro(error) {
  return (
    error.response?.data?.error ||
    error.response?.data?.mensagem ||
    error.response?.data?.message ||
    'Não foi possível salvar o atendimento.'
  );
}

function horarioComSegundos(valor) {
  return valor && valor.length === 5 ? `${valor}:00` : valor;
}

export default function FormularioAtendimento() {
  const { id } = useParams();
  const editar = Boolean(id);
  const navigate = useNavigate();
  const [dados, setDados] = useState(vazio);
  const [carregando, setCarregando] = useState(editar);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!editar) return;
    const controller = new AbortController();
    buscarPorId(id, controller.signal)
      .then((atendimento) => {
        if (!controller.signal.aborted) {
          setDados({
            ...vazio,
            ...atendimento,
            horario_inicio: atendimento.horario_inicio?.slice(0, 5) || '',
            horario_fim: atendimento.horario_fim?.slice(0, 5) || '',
          });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) setErro(mensagemErro(error));
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });
    return () => controller.abort();
  }, [editar, id]);

  function alterarCampo(event) {
    const { name, value } = event.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(event) {
    event.preventDefault();
    setSalvando(true);
    setErro('');
    const payload = {
      ...dados,
      idAtendimento: Number(dados.idAtendimento),
      valorTotal: Number(dados.valorTotal),
      parcelas: Number(dados.parcelas),
      horario_inicio: horarioComSegundos(dados.horario_inicio),
      horario_fim: horarioComSegundos(dados.horario_fim),
    };
    delete payload._id;
    delete payload.createdAt;
    delete payload.updatedAt;

    try {
      const atendimento = editar
        ? await atualizar(id, payload)
        : await criar(payload);
      navigate(
        atendimento?._id ? `/atendimentos/${atendimento._id}` : '/atendimentos',
      );
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <MensagemEstado>Carregando atendimento…</MensagemEstado>;
  }

  return (
    <Pagina className="pagina-formulario-atendimento">
      <Header
        titulo={editar ? 'Editar atendimento' : 'Cadastrar atendimento'}
        descricao={
          editar
            ? 'Atualize os dados do atendimento selecionado.'
            : 'Preencha os dados para criar um novo atendimento.'
        }
      />
      <Formulario onSubmit={enviar}>
        {erro && <MensagemEstado tipo="erro">{erro}</MensagemEstado>}
        <CamposFormulario>
          <CampoFormulario rotulo="Número do atendimento">
            <CampoInput
              required
              min="1"
              name="idAtendimento"
              type="number"
              value={dados.idAtendimento}
              onChange={alterarCampo}
            />
          </CampoFormulario>
          <CampoFormulario rotulo="Data">
            <CampoInput
              required
              name="data"
              type="date"
              value={dados.data}
              onChange={alterarCampo}
            />
          </CampoFormulario>
          <CampoFormulario rotulo="Horário de início">
            <CampoInput
              required
              name="horario_inicio"
              type="time"
              step="1"
              value={dados.horario_inicio}
              onChange={alterarCampo}
            />
          </CampoFormulario>
          <CampoFormulario rotulo="Horário de fim">
            <CampoInput
              required
              name="horario_fim"
              type="time"
              step="1"
              value={dados.horario_fim}
              onChange={alterarCampo}
            />
          </CampoFormulario>
          <CampoFormulario rotulo="CPF do paciente">
            <CampoInput
              required
              name="fk_CPF_Paciente"
              inputMode="numeric"
              pattern="[0-9]{11}"
              value={dados.fk_CPF_Paciente}
              onChange={alterarCampo}
            />
          </CampoFormulario>
          <CampoFormulario rotulo="CPF da secretária">
            <CampoInput
              required
              name="fk_CPF_Secretaria"
              inputMode="numeric"
              pattern="[0-9]{11}"
              value={dados.fk_CPF_Secretaria}
              onChange={alterarCampo}
            />
          </CampoFormulario>
          <CampoFormulario rotulo="Valor total">
            <CampoInput
              required
              min="0"
              step="0.01"
              name="valorTotal"
              type="number"
              value={dados.valorTotal}
              onChange={alterarCampo}
            />
          </CampoFormulario>
          <CampoFormulario rotulo="Parcelas">
            <CampoInput
              required
              min="1"
              name="parcelas"
              type="number"
              value={dados.parcelas}
              onChange={alterarCampo}
            />
          </CampoFormulario>
          <CampoFormulario rotulo="Tipo">
            <CampoSelect
              name="tipoAtendimento"
              value={dados.tipoAtendimento}
              onChange={alterarCampo}
              options={[{ valor: 'CLÍNICO', rotulo: 'Clínico' }]}
            />
          </CampoFormulario>
          <CampoFormulario rotulo="Status">
            <CampoSelect
              name="status"
              value={dados.status}
              onChange={alterarCampo}
              options={[
                { valor: 'AGENDADO', rotulo: 'Agendado' },
                { valor: 'CANCELADO', rotulo: 'Cancelado' },
                { valor: 'CONCLUIDO', rotulo: 'Concluído' },
              ]}
            />
          </CampoFormulario>
          <CampoFormulario rotulo="Observação" largo>
            <CampoTexto
              name="observacao"
              rows="4"
              value={dados.observacao}
              onChange={alterarCampo}
            />
          </CampoFormulario>
        </CamposFormulario>
        <AcoesFormulario>
          <Botao
            variante="secundario"
            onClick={() => navigate('/atendimentos')}
          >
            Cancelar
          </Botao>
          <Botao type="submit" disabled={salvando}>
            {salvando
              ? 'Salvando…'
              : editar
                ? 'Salvar alterações'
                : 'Cadastrar atendimento'}
          </Botao>
        </AcoesFormulario>
      </Formulario>
    </Pagina>
  );
}
