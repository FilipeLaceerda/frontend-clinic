import { useEffect, useState } from 'react';
import Botao from '../Botao';
import MensagemEstado from '../MensagemEstado';
import './estilo.css';

export default function ConfirmacaoExclusao({
  nomeItem,
  onCancelar,
  onConfirmar,
  processando = false,
  erro = '',
}) {
  const [dialogo, setDialogo] = useState(null);

  useEffect(() => {
    if (!dialogo) return;
    const focoAnterior = document.activeElement;
    dialogo.showModal();

    return () => {
      dialogo.close();
      if (focoAnterior?.isConnected) focoAnterior.focus();
    };
  }, [dialogo]);

  return (
    <dialog
      ref={setDialogo}
      className="confirmacao-exclusao"
      aria-labelledby="confirmacao-exclusao-titulo"
      aria-describedby="confirmacao-exclusao-descricao"
      aria-busy={processando}
      onCancel={(event) => {
        event.preventDefault();
        if (!processando) onCancelar();
      }}
    >
      <h2 id="confirmacao-exclusao-titulo">Confirmar exclusão</h2>
      <p id="confirmacao-exclusao-descricao">
        Deseja realmente excluir <strong>{nomeItem}</strong>?
        {' '}Esta ação é permanente e não poderá ser desfeita.
      </p>
      {erro && <MensagemEstado tipo="erro">{erro}</MensagemEstado>}
      {processando && <p role="status">Excluindo…</p>}
      <div className="confirmacao-exclusao__acoes">
        <Botao
          variante="secundario"
          autoFocus
          disabled={processando}
          onClick={onCancelar}
        >
          Cancelar
        </Botao>
        <Botao
          className="confirmacao-exclusao__confirmar"
          disabled={processando}
          onClick={onConfirmar}
        >
          {processando ? 'Excluindo…' : 'Confirmar exclusão'}
        </Botao>
      </div>
    </dialog>
  );
}
