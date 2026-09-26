import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AcoesTabela from "../components/AcoesTabela";
import BotaoCadastrar from "../components/BotaoCadastrar/BotaoCadastrar";
import CabecalhoComAcao from "../components/CabecalhoComAcao";
import { listar, atualizar, excluir } from "../services/secretariaService";

const normalizar = (valor) =>
  String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

export default function Secretarias() {
  const navigate = useNavigate();
  const [dados, setDados] = useState([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [valorEditado, setValorEditado] = useState("");
  const [processandoId, setProcessandoId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setCarregando(true);
    setErro("");

    listar({}, controller.signal)
      .then((lista) => {
        if (!controller.signal.aborted) setDados(lista || []);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setErro(
            error.response?.data?.error ||
              error.response?.data?.mensagem ||
              error.response?.data?.message ||
              "Não foi possível carregar as secretárias.",
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setCarregando(false);
      });

    return () => controller.abort();
  }, []);

  const filtrados = dados.filter((item) =>
    normalizar(item.nome).includes(normalizar(busca.trim())),
  );

  const cancelarEdicao = () => {
    setEditandoId(null);
    setValorEditado("");
  };

  const abrirEdicao = (item) => {
    setEditandoId(item._id);
    setValorEditado(item.nome ?? "");
  };

  const handleSalvar = async (id) => {
    const nomeAtualizado = valorEditado.trim();

    if (!nomeAtualizado) {
      return;
    }

    try {
      setProcessandoId(id);
      await atualizar(id, { nome: nomeAtualizado });
      setDados((lista) =>
        lista.map((item) =>
          item._id === id ? { ...item, nome: nomeAtualizado } : item,
        ),
      );
      cancelarEdicao();
    } catch (error) {
      alert(
        error.response?.data?.error ||
          error.response?.data?.mensagem ||
          error.response?.data?.message ||
          "Não foi possível atualizar a secretária.",
      );
    } finally {
      setProcessandoId(null);
    }
  };

  const handleExcluir = async (item) => {
    const nome = item.nome || "esta secretária";

    if (!window.confirm(`Deseja realmente excluir ${nome}?`)) {
      return;
    }

    try {
      setProcessandoId(item._id);
      await excluir(item._id);
      setDados((lista) =>
        lista.filter((secretaria) => secretaria._id !== item._id),
      );
      if (editandoId === item._id) {
        cancelarEdicao();
      }
    } catch (error) {
      alert(
        error.response?.data?.error ||
          error.response?.data?.mensagem ||
          error.response?.data?.message ||
          "Não foi possível excluir a secretária.",
      );
    } finally {
      setProcessandoId(null);
    }
  };

  return (
    <section>
      <CabecalhoComAcao
        titulo="Secretárias"
        descricao="Equipe responsável pela recepção e pelos agendamentos."
        acao={
          <BotaoCadastrar
            labelButton="Cadastrar secretária"
            onClick={() => navigate("/secretarias/novo")}
          />
        }
      />

      <div className="card">
        <div className="toolbar">
          <label>
            Buscar na lista
            <input
              type="search"
              placeholder="Digite para buscar…"
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
            Carregando dados…
          </p>
        ) : erro ? (
          <div className="notice" role="alert">
            <p>{erro}</p>
            <button type="button" onClick={() => window.location.reload()}>
              Tentar novamente
            </button>
          </div>
        ) : filtrados.length === 0 ? (
          <p className="notice" role="status">
            Nenhuma secretária encontrada.
          </p>
        ) : (
          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Lista de secretárias"
          >
            <table>
              <caption className="sr-only">Secretárias</caption>
              <thead>
                <tr>
                  <th scope="col">Nome</th>
                  <th scope="col" className="actions-column">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((item) => {
                  const emEdicao = editandoId === item._id;

                  return (
                    <tr key={item._id || item.id || item.nome}>
                      <td>
                        {emEdicao ? (
                          <input
                            className="inline-input"
                            type="text"
                            value={valorEditado}
                            onChange={(event) =>
                              setValorEditado(event.target.value)
                            }
                            aria-label={`Editar nome da secretária ${item.nome}`}
                          />
                        ) : (
                          item.nome || "—"
                        )}
                      </td>

                      <td className="table-actions">
                        <AcoesTabela
                          item={item}
                          emEdicao={emEdicao}
                          valorEditado={valorEditado}
                          onChangeValor={setValorEditado}
                          onEditar={() => abrirEdicao(item)}
                          onSalvar={() => handleSalvar(item._id)}
                          onCancelar={cancelarEdicao}
                          onExcluir={() => handleExcluir(item)}
                          processandoId={processandoId}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
