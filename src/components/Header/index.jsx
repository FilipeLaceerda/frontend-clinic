
import './estilo.css'

function Header({ titulo, descricao }) {
  return (
    <header className="header">
      <span className="eyebrow">PAINEL DA CLÍNICA</span>
      <h1>{titulo}</h1>
      <p>{descricao}</p>
    </header>
  )
}

export default Header
