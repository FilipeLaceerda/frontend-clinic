import { useEffect, useState } from "react";

const formularioVazio = {
  _id: "",
  nome: "",
  CRO: "",
  croUF: "",
  especialidade: "",
};

export default function FormDentista({
  dentista = null,
  onSalvar = () => {},
  onCancelar = () => {},
  salvando = false,
}) {
  const [formulario, setFormulario] = useState(formularioVazio);

  const editando = Boolean(dentista);

  useEffect(() => {
    if (dentista) {
      setFormulario({
        _id: dentista._id ?? "",
        nome: dentista.nome ?? "",
        CRO: dentista.CRO ?? "",
        croUF: dentista.croUF ?? "",
        especialidade: dentista.especialidade ?? "",
      });

      return;
    }

    const rascunho = localStorage.getItem("dentista-rascunho");

    if (rascunho) {
      try {
        setFormulario(JSON.parse(rascunho));
      } catch {
        localStorage.removeItem("dentista-rascunho");
        setFormulario(formularioVazio);
      }
    } else {
      setFormulario(formularioVazio);
    }
  }, [dentista]);

  function alterarCampo(event) {
    const { name, value } = event.target;

    setFormulario((anterior) => {
      const atualizado = {
        ...anterior,
        [name]: value,
      };

      if (!editando) {
        localStorage.setItem("dentista-rascunho", JSON.stringify(atualizado));
      }

      return atualizado;
    });
  }

  function enviar(event) {
    event.preventDefault();
    onSalvar(formulario);
  }

  return (
    <form className="card" onSubmit={enviar}>
      <h2>{editando ? "Editar dentista" : "Novo dentista"}</h2>

      <label>
        Nome
        <input
          name="nome"
          value={formulario.nome}
          onChange={alterarCampo}
          required
        />
      </label>

      <label>
        CPF
        <input
          name="_id"
          value={formulario._id}
          onChange={alterarCampo}
          disabled={editando}
          required
        />
      </label>

      <label>
        CRO
        <input
          name="CRO"
          value={formulario.CRO}
          onChange={alterarCampo}
          required
        />
      </label>

      <label>
        UF
        <input
          name="croUF"
          value={formulario.croUF}
          onChange={alterarCampo}
          maxLength={2}
          required
        />
      </label>

      <label>
        Especialidade
        <input
          name="especialidade"
          value={formulario.especialidade}
          onChange={alterarCampo}
          required
        />
      </label>

      <div className="acoes">
        <button type="submit" disabled={salvando}>
          {salvando ? "Salvando..." : editando ? "Atualizar" : "Cadastrar"}
        </button>

        {editando && (
          <button type="button" onClick={onCancelar}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
