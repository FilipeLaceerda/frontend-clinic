import Listagem from "../Listagem";

const colunas = [
  { campo: "nome", titulo: "Nome" },
  { campo: "_id", titulo: "CPF" },
  { campo: "CRO", titulo: "CRO" },
  { campo: "croUF", titulo: "UF" },
  { campo: "especialidade", titulo: "Especialidade" },
];

export default function ListagemDentistas({
  atualizacao = 0,
  onEditar = () => {},
  onExcluir = () => {},
}) {
  return (
    <Listagem
      titulo="Dentistas"
      descricao="Profissionais e especialidades da clínica."
      recurso="dentistas"
      colunas={colunas}
      atualizacao={atualizacao}
      renderAcoes={(dentista) => (
        <div className="acoes">
          <button type="button" onClick={() => onEditar(dentista)}>
            Editar
          </button>
          <button type="button" onClick={() => onExcluir(dentista)}>
            Excluir
          </button>
        </div>
      )}
    />
  );
}
