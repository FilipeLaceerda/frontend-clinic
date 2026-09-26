import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Botao from '../../components/Botao';
import CampoFormulario from '../../components/CampoFormulario';
import CampoInput from '../../components/CampoInput';
import { AcoesFormulario, CamposFormulario, Formulario } from '../../components/Formulario';
import Header from '../../components/Header';
import MensagemEstado from '../../components/MensagemEstado';
import Pagina from '../../components/Pagina';
import { atualizar, buscarPorId, criar } from '../../services/secretariaService';

const vazio = { nome: '', cpf: '' };

function mensagemDoErro(error, padrao) {
  return (
    error.response?.data?.error ||
    error.response?.data?.mensagem ||
    error.response?.data?.message ||
    padrao
  );
}

export default function FormularioSecretaria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);
  const [dados, setDados] = useState(vazio);
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!editando) return undefined;

    const controller = new AbortController();
    setCarregando(true);
    setErro('');

    buscarPorId(id, controller.signal)
      .then((secretaria) => {
        if (!controller.signal.aborted) {
          setDados({ nome: secretaria.nome || '', cpf: secretaria.cpf || '' });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErro(mensagemDoErro(error, 'Não foi possível carregar a secretária.'));
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });

    return () => controller.abort();
  }, [editando, id]);

  function alterarCampo(event) {
    const { name, value } = event.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(event) {
    event.preventDefault();
    const nome = dados.nome.trim();
    const cpf = dados.cpf.trim();

    if (!nome || !/^\d{11}$/.test(cpf)) {
      setErro('Informe o nome e o CPF da secretária com 11 dígitos.');
      return;
    }

    try {
      setSalvando(true);
      setErro('');
      if (editando) {
        await atualizar(id, { nome, cpf });
      } else {
        await criar({ nome, cpf });
      }
      navigate('/secretarias');
    } catch (error) {
      setErro(mensagemDoErro(error, 'Não foi possível salvar a secretária.'));
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Pagina>
      <Header
        titulo={editando ? 'Editar secretária' : 'Cadastrar secretária'}
        descricao="Informe os dados da secretária da clínica."
      />

      {erro && <MensagemEstado tipo="erro">{erro}</MensagemEstado>}

      {!carregando && (
        <Formulario onSubmit={enviar}>
          <CamposFormulario>
            <CampoFormulario rotulo="Nome">
              <CampoInput
                name="nome"
                value={dados.nome}
                onChange={alterarCampo}
                placeholder="Digite o nome da secretária"
                required
              />
            </CampoFormulario>

            <CampoFormulario rotulo="CPF">
              <CampoInput
                name="cpf"
                inputMode="numeric"
                pattern="[0-9]{11}"
                value={dados.cpf}
                onChange={alterarCampo}
                placeholder="Somente os 11 dígitos"
                required
              />
            </CampoFormulario>
          </CamposFormulario>

          <AcoesFormulario>
            <Botao variante="secundario" onClick={() => navigate('/secretarias')}>
              Cancelar
            </Botao>
            <Botao type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar secretária'}
            </Botao>
          </AcoesFormulario>
        </Formulario>
      )}
    </Pagina>
  );
}
