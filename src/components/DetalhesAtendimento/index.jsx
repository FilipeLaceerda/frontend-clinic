import './estilo.css';

export default function DetalhesAtendimento({ campos }) {
  return (
    <dl className="detalhes-atendimento">
      {campos.map(([titulo, valor]) => (
        <div key={titulo}>
          <dt>{titulo}</dt>
          <dd>{valor}</dd>
        </div>
      ))}
    </dl>
  );
}
