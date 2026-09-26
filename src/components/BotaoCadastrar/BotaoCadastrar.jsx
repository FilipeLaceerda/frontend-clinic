import './style.css'

export default function BotaoCadastrar({ labelButton = 'Cadastrar atendimento', onClick }) {
  return (
    <button className="botao-acao" type="button" onClick={onClick}>
      {labelButton}
    </button>
  );
}
