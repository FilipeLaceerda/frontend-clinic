import Header from "../Header";
import "./estilo.css";

export default function CabecalhoComAcao({ titulo, descricao, acao }) {
  return (
    <div className="cabecalho-com-acao">
      <Header titulo={titulo} descricao={descricao} />
      {acao}
    </div>
  );
}
