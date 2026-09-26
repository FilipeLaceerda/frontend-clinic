import { useState, useEffect } from 'react';
import { listar } from '../services/procedimentoService';
import { moeda } from '../utils/formatadores';

import Header from '../components/Header';
import CampoBusca from '../components/CampoBusca';
import Tabela from '../components/Tabela';


const colunas = [
  { campo: 'nome', titulo: 'Nome' },
  { campo: 'descricao', titulo: 'Descrição' },
  { campo: 'tipoProcedimento', titulo: 'Tipo' },
  { campo: 'valor', titulo: 'Valor', formatar: moeda },
];

export default function Procedimentos() {
  const [procedimentos, setProcedimentos] = useState([]);
  const [busca, setBusca] = useState('');

  function normalizar(valor) {
    return String(valor ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  const procedimentosFiltrados = procedimentos.filter((procedimento) =>
    colunas.some((coluna) => {
      const valor = coluna.formatar
        ? coluna.formatar(procedimento[coluna.campo])
        : procedimento[coluna.campo];

      return normalizar(valor).includes(normalizar(busca.trim()));
    })
  );

  return (
    <section>
      <Header
        titulo="Procedimentos"
        descricao="Consulte os procedimentos oferecidos e seus valores."
      />

      <div className="card">
        <div className="toolbar">
          <CampoBusca
            rotulo="Buscar procedimentos"
            placeholder="Digite para buscar…"
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
          />
        </div>

        <Tabela
          titulo="Procedimentos"
          colunas={colunas}
          dados={procedimentos}
        />
      </div>
    </section>
  );
}
