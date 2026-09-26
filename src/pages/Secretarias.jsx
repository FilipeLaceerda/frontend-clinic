import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AcoesTabela from '../components/AcoesTabela';
import Botao from '../components/Botao';
import CabecalhoComAcao from '../components/CabecalhoComAcao';
import ConfirmacaoExclusao from '../components/ConfirmacaoExclusao';
import Listagem from '../components/Listagem';
import Pagina from '../components/Pagina';
import { excluir, listar } from '../services/secretariaService';

const colunas = [
  { campo: 'nome', titulo: 'Nome' },
  { campo: 'cpf', titulo: 'CPF' },
];

export default function Secretarias() {
  const navigate = useNavigate();
  const [secretariaParaExcluir, setSecretariaParaExcluir] = useState(null);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');
  const [atualizacao, setAtualizacao] = useState(0);

  function solicitarExclusao(secretaria) {
    setErroExclusao('');
    setSecretariaParaExcluir(secretaria);
  }

  function cancelarExclusao() {
    if (excluindo) return;
    setErroExclusao('');
    setSecretariaParaExcluir(null);
  }

  async function confirmarExclusao() {
    if (!secretariaParaExcluir?._id) return;

    try {
      setExcluindo(true);
      setErroExclusao('');
      await excluir(secretariaParaExcluir._id);
      setSecretariaParaExcluir(null);
      setAtualizacao((valor) => valor + 1);
    } catch (error) {
      setErroExclusao(
        error.response?.data?.error ||
          error.response?.data?.mensagem ||
          error.response?.data?.message ||
          'Não foi possível excluir a secretária.',
      );
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <Pagina>
      <CabecalhoComAcao
        titulo="Secretárias"
        descricao="Equipe responsável pela recepção e pelos agendamentos."
        acao={
          <Botao onClick={() => navigate('/secretarias/novo')}>
            Cadastrar secretária
          </Botao>
        }
      />

      <Listagem
        tituloTabela="Secretárias"
        carregar={listar}
        colunas={colunas}
        atualizacao={atualizacao}
        rotuloBusca="Buscar secretária"
        placeholderBusca="Nome ou CPF"
        buscarEm={(secretaria) => [secretaria.nome, secretaria.cpf]}
        mensagemVazio="Nenhuma secretária encontrada."
        renderAcoes={(secretaria) => (
          <div className="table-actions">
            <AcoesTabela
              item={secretaria}
              onEditar={() => navigate(`/secretarias/${secretaria._id}/editar`)}
              onExcluir={() => solicitarExclusao(secretaria)}
              disabled={excluindo}
            />
          </div>
        )}
      />

      {secretariaParaExcluir && (
        <ConfirmacaoExclusao
          nomeItem={secretariaParaExcluir.nome || 'esta secretária'}
          processando={excluindo}
          erro={erroExclusao}
          onCancelar={cancelarExclusao}
          onConfirmar={confirmarExclusao}
        />
      )}
    </Pagina>
  );
}
