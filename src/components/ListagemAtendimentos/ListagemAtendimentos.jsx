import { useEffect, useState } from "react";
import MaisAcoes from "../MaisAcoes/MaisAcoes";
import TituloColuna from "../TituloColuna/TituloColuna";
import "./ListagemAtendimentos.css";

const statusLegivel = (valor) =>
  ({
    AGENDADO: "Agendado",
    CANCELADO: "Cancelado",
    CONCLUIDO: "Concluído",
    CONCLUÍDO: "Concluído",
  })[valor] ||
  valor ||
  "—";
const dataBR = (valor) => (valor ? valor.split("-").reverse().join("/") : "—");
const horario = (valor) => (valor ? valor.slice(0, 5) : "—");

export default function ListagemAtendimentos({
  carregar,
  onEditar,
  onVisualizar,
}) {
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro("");
    carregar({}, controller.signal)
      .then((lista) => {
        if (!controller.signal.aborted) setDados(lista);
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setErro(
            error.response?.data?.error ||
              error.response?.data?.mensagem ||
              error.response?.data?.message ||
              "Não foi possível carregar os atendimentos.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });
    return () => controller.abort();
  }, [carregar, tentativa]);

  const termo = busca
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const filtrados = dados.filter((atendimento) =>
    [
      atendimento.idAtendimento,
      atendimento.fk_CPF_Paciente,
      atendimento.observacao,
      statusLegivel(atendimento.status),
    ].some((valor) =>
      String(valor ?? "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(termo),
    ),
  );

  return (
    <div className="card listagem-atendimentos">
      <div className="toolbar">
        <label>
          Buscar atendimento
          <input
            type="search"
            placeholder="Número, CPF, status ou observação"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </label>
        {!carregando && !erro && (
          <span role="status">{filtrados.length} registro(s)</span>
        )}
      </div>
      {carregando ? (
        <p className="notice" role="status">
          Carregando atendimentos…
        </p>
      ) : erro ? (
        <div className="notice" role="alert">
          <p>{erro}</p>
          <button
            type="button"
            onClick={() => setTentativa((valor) => valor + 1)}
          >
            Tentar novamente
          </button>
        </div>
      ) : filtrados.length === 0 ? (
        <p className="notice" role="status">
          Nenhum atendimento encontrado.
        </p>
      ) : (
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Lista resumida de atendimentos"
        >
          <table>
            <caption className="sr-only">Atendimentos</caption>
            <thead>
              <tr>
                <TituloColuna>Número</TituloColuna>
                <TituloColuna>Data e horário</TituloColuna>
                <TituloColuna>CPF do paciente</TituloColuna>
                <TituloColuna>Status</TituloColuna>
                <TituloColuna>Ações</TituloColuna>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((atendimento) => (
                <tr key={atendimento._id || atendimento.idAtendimento}>
                  <td>#{atendimento.idAtendimento}</td>
                  <td>
                    {dataBR(atendimento.data)} ·{" "}
                    {horario(atendimento.horario_inicio)}–
                    {horario(atendimento.horario_fim)}
                  </td>
                  <td>{atendimento.fk_CPF_Paciente}</td>
                  <td>
                    <span className="status-atendimento">
                      {statusLegivel(atendimento.status)}
                    </span>
                  </td>
                  <td>
                    <MaisAcoes
                      atendimento={atendimento}
                      onEditar={onEditar}
                      onVisualizar={onVisualizar}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
