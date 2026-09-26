import { useEffect, useState } from "react";

import Botao from "../Botao";
import CampoFormulario from "../CampoFormulario";
import CampoInput from "../CampoInput";
import { AcoesFormulario, CamposFormulario, Formulario } from "../Formulario";

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

    if (!rascunho) {
      setFormulario(formularioVazio);
      return;
    }

    try {
      setFormulario(JSON.parse(rascunho));
    } catch {
      localStorage.removeItem("dentista-rascunho");
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
    <Formulario onSubmit={enviar}>
      <CamposFormulario>
        <CampoFormulario rotulo="Nome">
          <CampoInput
            required
            name="nome"
            value={formulario.nome}
            onChange={alterarCampo}
          />
        </CampoFormulario>

        <CampoFormulario rotulo="CPF">
          <CampoInput
            required
            name="_id"
            inputMode="numeric"
            pattern="[0-9]{11}"
            value={formulario._id}
            onChange={alterarCampo}
            disabled={editando}
          />
        </CampoFormulario>

        <CampoFormulario rotulo="CRO">
          <CampoInput
            required
            name="CRO"
            value={formulario.CRO}
            onChange={alterarCampo}
          />
        </CampoFormulario>

        <CampoFormulario rotulo="UF">
          <CampoInput
            required
            name="croUF"
            maxLength={2}
            value={formulario.croUF}
            onChange={alterarCampo}
          />
        </CampoFormulario>

        <CampoFormulario rotulo="Especialidade" largo>
          <CampoInput
            required
            name="especialidade"
            value={formulario.especialidade}
            onChange={alterarCampo}
          />
        </CampoFormulario>
      </CamposFormulario>

      <AcoesFormulario>
        <Botao variante="secundario" onClick={onCancelar} type="button">
          Cancelar
        </Botao>

        <Botao type="submit" disabled={salvando}>
          {salvando
            ? "Salvando…"
            : editando
              ? "Salvar alterações"
              : "Cadastrar dentista"}
        </Botao>
      </AcoesFormulario>
    </Formulario>
  );
}
