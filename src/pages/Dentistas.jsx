import { useState } from "react";

import FormDentista from "../components/dentistas/FormDentista";
import ListagemDentistas from "../components/dentistas/ListagemDentistas";
import { atualizar, criar, remover } from "../services/api";

const RECURSO = "dentistas";

export default function Dentistas() {
  const [dentistaSelecionado, setDentistaSelecionado] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [atualizacao, setAtualizacao] = useState(0);

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
  }

  async function salvarDentista(dados) {
    try {
      setSalvando(true);
      setErro("");

      if (dentistaSelecionado) {
        await atualizar(RECURSO, dentistaSelecionado._id, dados);
      } else {
        await criar(RECURSO, dados);
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

  async function excluirDentista(dentista) {
    const confirmou = window.confirm(`Deseja excluir ${dentista.nome}?`);

    if (!confirmou) {
      return;
    }

    try {
      setErro("");
      await remover(RECURSO, dentista._id);

      if (dentistaSelecionado?._id === dentista._id) {
        cancelarFormulario();
      }

      recarregarLista();
    } catch (error) {
      setErro(error.message || "Não foi possível excluir o dentista.");
    }
  }

  return (
    <>
      <div className="toolbar">
        <button type="button" onClick={novoDentista}>
          Novo dentista
        </button>
      </div>

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

      <ListagemDentistas
        atualizacao={atualizacao}
        onEditar={editarDentista}
        onExcluir={excluirDentista}
      />
    </>
  );
}
