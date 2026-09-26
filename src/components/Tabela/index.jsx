import './estilo.css';

export default function Tabela({ titulo, colunas, dados }) {
  return (
    <div className="table-scroll" tabIndex={0} role="region" aria-label={`Lista de ${titulo.toLowerCase()}`}>
      <table>
        <caption className="sr-only">{titulo}</caption>
        <thead>
          <tr>
            {colunas.map((coluna) => (
              <th scope="col" key={coluna.campo}>{coluna.titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dados.map((item, index) => (
            <tr key={item._id || item.idAtendimento || item.idProcedimento || item.id || index}>
              {colunas.map((coluna) => (
                <td key={coluna.campo}>
                  {coluna.formatar ? coluna.formatar(item[coluna.campo]) : (item[coluna.campo] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
