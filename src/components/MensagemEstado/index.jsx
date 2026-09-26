import './estilo.css';

export default function MensagemEstado({ tipo = 'informacao', children, acao }) {
  return (
    <div className={`mensagem-estado mensagem-estado-${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      <p>{children}</p>
      {acao}
    </div>
  );
}
