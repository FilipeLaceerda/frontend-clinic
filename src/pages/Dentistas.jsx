import { useState } from "react";

import AcoesTabela from '../components/AcoesTabela';
import Listagem from "../components/Listagem";
import FormDentista from "../components/dentistas/FormDentista";
import ConfirmacaoExclusao from '../components/ConfirmacaoExclusao';
import { atualizar, criar, excluir, listar } from "../services/dentistaService";
import CabecalhoComAcao from "../components/CabecalhoComAcao";
import Botao from '../components/Botao';

const colunas = [
  { campo: "nome", titulo: "Nome" },
  { campo: "_id", titulo: "CPF" },
  { campo: "CRO", titulo: "CRO" },
  { campo: "croUF", titulo: "UF" },
  { campo: "especialidade", titulo: "Especialidade" },
];

export default function Dentistas() {
  const [dentistaSelecionado, setDentistaSelecionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);
  const [dentistaParaExcluir, setDentistaParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');

  function recarregarLista() {
    setAtualizacao((valor) => valor + 1);
  }

  function novoDentista() {
    setDentistaSelecionado(null);
    setErro("");
    setMostrarFormulario(true);
  }

  function editarDentista(dentista) {
    setDentistaSelecionado(dentista);
    setErro("");
    setMostrarFormulario(true);
  }

  function cancelarFormulario() {
    setDentistaSelecionado(null);
    setMostrarFormulario(false);
    // localStorage.removeItem("dentista-rascunho");
  }

  async function salvarDentista(dados) {
    try {
      setSalvando(true);
      setErro("");

      if (dentistaSelecionado) {
        await atualizar(dentistaSelecionado._id, dados);
      } else {
        await criar(dados);
        localStorage.removeItem("dentista-rascunho");
      }

      cancelarFormulario();
      recarregarLista();
    } catch (error) {
      setErro(error.message || "Não foi possível salvar o dentista.");
    } finally {
      setSalvando(false);
    }
  }

  function solicitarExclusao(dentista) {
    setDentistaParaExcluir(dentista);
    setErroExclusao('');
  }

  function cancelarExclusao() {
    if (excluindo) return;
    setDentistaParaExcluir(null);
    setErroExclusao('');
  }

  async function confirmarExclusao() {
    if (!dentistaParaExcluir) return;

    try {
      setExcluindo(true);
      setErroExclusao('');
      await excluir(dentistaParaExcluir._id);

      if (dentistaSelecionado?._id === dentistaParaExcluir._id) {
        cancelarFormulario();
      }

      setDentistaParaExcluir(null);
      recarregarLista();
    } catch (error) {
      setErroExclusao(error.message || 'Não foi possível excluir o dentista.');
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <>
      <CabecalhoComAcao
        titulo="Dentistas"
        descricao="Profissionais e especialidades da clínica."
        acao={<Botao onClick={novoDentista}>Cadastrar dentista</Botao>}
      />

      {mostrarFormulario && (
        <FormDentista
          dentista={dentistaSelecionado}
          onSalvar={salvarDentista}
          onCancelar={cancelarFormulario}
          salvando={salvando}
        />
      )}

      {erro && (
        <p className="notice" role="alert">
          {erro}
        </p>
      )}

      {dentistaParaExcluir && (
        <ConfirmacaoExclusao
          nomeItem={dentistaParaExcluir.nome}
          processando={excluindo}
          erro={erroExclusao}
          onCancelar={cancelarExclusao}
          onConfirmar={confirmarExclusao}
        />
      )}

      <Listagem
        tituloTabela="Dentistas"
        carregar={listar}
        colunas={colunas}
        atualizacao={atualizacao}
        renderAcoes={(dentista) => (
          <div className="table-actions">
            <AcoesTabela
              item={dentista}
              onEditar={() => editarDentista(dentista)}
              onExcluir={() => solicitarExclusao(dentista)}
            />
          </div>
        )}
      />
    </>
  );
}
