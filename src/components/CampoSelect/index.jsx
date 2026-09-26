import './estilo.css';

export default function CampoSelect({ options, ...props }) {
  return (
    <select className="campo-select" {...props}>
      {options.map(({ valor, rotulo }) => (
        <option key={valor} value={valor}>
          {rotulo}
        </option>
      ))}
    </select>
  );
}
