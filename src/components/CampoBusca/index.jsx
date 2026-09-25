import CampoInput from '../CampoInput';
import './estilo.css';

export default function CampoBusca({ rotulo, placeholder, value, onChange }) {
  return (
    <label className="campo-busca">
      {rotulo}
      <CampoInput
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
