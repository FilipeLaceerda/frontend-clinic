import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { criar } from "../../services/secretariaService";
import "./FormularioSecretaria.css";

const vazio = {
  nome: "",
  cpf: "",
};

export default function FormularioSecretaria() {
  const navigate = useNavigate();
  const [dados, setDados] = useState(vazio);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  function alterarCampo(event) {
    const { name, value } = event.target;
    setDados((anterior) => ({ ...anterior, [name]: value }));
  }

  async function enviar(event) {
    event.preventDefault();
    const nome = dados.nome.trim();
    const cpf = dados.cpf.trim();

    if (!nome || !/^\d{11}$/.test(cpf)) {
      setErro("Informe o nome e o CPF da secretária com 11 dígitos.");
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      await criar({ nome, cpf });
      navigate("/secretarias");
    } catch (error) {
      setErro(
        error.response?.data?.error ||
          error.response?.data?.mensagem ||
          error.response?.data?.message ||
          "Não foi possível cadastrar a secretária.",
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <section>
      <Header
        titulo="Cadastrar secretária"
        descricao="Preencha os dados para incluir uma nova secretária na clínica."
      />

      <div className="card">
        <form onSubmit={enviar} style={{ padding: "24px" }}>
          {erro && (
            <p
              className="notice"
              role="alert"
              style={{ padding: 0, marginBottom: "16px" }}
            >
              {erro}
            </p>
          )}

          <label
            style={{
              display: "grid",
              gap: "8px",
              fontWeight: 600,
              color: "#35515a",
            }}
          >
            Nome
            <input
              type="text"
              name="nome"
              value={dados.nome}
              onChange={alterarCampo}
              placeholder="Digite o nome da secretária"
              required
            />
          </label>

          <label
            style={{
              display: "grid",
              gap: "8px",
              marginTop: "16px",
              fontWeight: 600,
              color: "#35515a",
            }}
          >
            CPF
            <input
              type="text"
              name="cpf"
              inputMode="numeric"
              pattern="[0-9]{11}"
              value={dados.cpf}
              onChange={alterarCampo}
              placeholder="Somente os 11 dígitos"
              required
            />
          </label>

          <div className="formulario-secretaria__acoes">
            <button
              type="submit"
              className="formulario-secretaria__botao"
              disabled={salvando}
            >
              {salvando ? "Salvando..." : "Salvar secretária"}
            </button>
            <button
              type="button"
              className="formulario-secretaria__botao-cancelar"
              onClick={() => navigate("/secretarias")}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
