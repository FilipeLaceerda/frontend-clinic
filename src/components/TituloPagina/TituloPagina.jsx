import './TituloPagina.css';

export default function TituloPagina({ titulo, descricao }) {
  return <header className="titulo-pagina"><span className="eyebrow">PAINEL DA CLÍNICA</span><h1>{titulo}</h1><p>{descricao}</p></header>;
}
