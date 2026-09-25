import Listagem from '../components/Listagem';

const colunas = [{ campo: 'nome', titulo: 'Nome' }];

export default function Secretarias() {
  return <Listagem titulo="Secretárias" descricao="Equipe responsável pela recepção e pelos agendamentos." recurso="secretaria" colunas={colunas} />;
}
