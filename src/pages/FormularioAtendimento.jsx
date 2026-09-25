import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TituloPagina from '../components/TituloPagina/TituloPagina';
import { atualizar, buscarPorId, criar } from '../services/atendimentoService';
import './FormularioAtendimento.css';

const vazio = {
  idAtendimento: '', observacao: '', data: '', valorTotal: '', tipoAtendimento: 'CLÍNICO', parcelas: '1',
  fk_CPF_Paciente: '', fk_CPF_Secretaria: '', status: 'AGENDADO', horario_inicio: '', horario_fim: '',
};

function mensagemErro(error) {
  return error.response?.data?.error || error.response?.data?.mensagem || error.response?.data?.message || 'Não foi possível salvar o atendimento.';
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
          setDados({ ...vazio, ...atendimento, horario_inicio: atendimento.horario_inicio?.slice(0, 5) || '', horario_fim: atendimento.horario_fim?.slice(0, 5) || '' });
        }
      })
      .catch((error) => { if (!controller.signal.aborted) setErro(mensagemErro(error)); })
      .finally(() => { if (!controller.signal.aborted) setCarregando(false); });
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
      const atendimento = editar ? await atualizar(id, payload) : await criar(payload);
      navigate(atendimento?._id ? `/atendimentos/${atendimento._id}` : '/atendimentos');
    } catch (error) {
      setErro(mensagemErro(error));
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) return <p className="notice" role="status">Carregando atendimento…</p>;

  return (
    <section className="pagina-formulario-atendimento">
      <TituloPagina titulo={editar ? 'Editar atendimento' : 'Cadastrar atendimento'} descricao={editar ? 'Atualize os dados do atendimento selecionado.' : 'Preencha os dados para criar um novo atendimento.'} />
      <form className="formulario-atendimento" onSubmit={enviar}>
        {erro && <p className="erro-formulario" role="alert">{erro}</p>}
        <div className="campos-formulario">
          <label>Número do atendimento<input required min="1" name="idAtendimento" type="number" value={dados.idAtendimento} onChange={alterarCampo} /></label>
          <label>Data<input required name="data" type="date" value={dados.data} onChange={alterarCampo} /></label>
          <label>Horário de início<input required name="horario_inicio" type="time" step="1" value={dados.horario_inicio} onChange={alterarCampo} /></label>
          <label>Horário de fim<input required name="horario_fim" type="time" step="1" value={dados.horario_fim} onChange={alterarCampo} /></label>
          <label>CPF do paciente<input required name="fk_CPF_Paciente" inputMode="numeric" pattern="[0-9]{11}" value={dados.fk_CPF_Paciente} onChange={alterarCampo} /></label>
          <label>CPF da secretária<input required name="fk_CPF_Secretaria" inputMode="numeric" pattern="[0-9]{11}" value={dados.fk_CPF_Secretaria} onChange={alterarCampo} /></label>
          <label>Valor total<input required min="0" step="0.01" name="valorTotal" type="number" value={dados.valorTotal} onChange={alterarCampo} /></label>
          <label>Parcelas<input required min="1" name="parcelas" type="number" value={dados.parcelas} onChange={alterarCampo} /></label>
          <label>Tipo<select name="tipoAtendimento" value={dados.tipoAtendimento} onChange={alterarCampo}><option value="CLÍNICO">Clínico</option></select></label>
          <label>Status<select name="status" value={dados.status} onChange={alterarCampo}><option value="AGENDADO">Agendado</option><option value="CANCELADO">Cancelado</option><option value="CONCLUIDO">Concluído</option></select></label>
          <label className="campo-largo">Observação<textarea name="observacao" rows="4" value={dados.observacao} onChange={alterarCampo} /></label>
        </div>
        <div className="acoes-formulario">
          <button type="button" className="botao-secundario" onClick={() => navigate('/atendimentos')}>Cancelar</button>
          <button type="submit" disabled={salvando}>{salvando ? 'Salvando…' : editar ? 'Salvar alterações' : 'Cadastrar atendimento'}</button>
        </div>
      </form>
    </section>
  );
}
