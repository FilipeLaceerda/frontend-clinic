# Frontend Clinic

Esqueleto em React + Vite, com JavaScript e CSS simples.

## Executar

```sh
npm install
npm run dev
```

Abra o endereço exibido pelo Vite (normalmente http://localhost:5173).

```sh
npm run build
npm run preview
```

## Páginas

- `/atendimentos`: data, horários, CPFs, tipo, status, valor, parcelas e observação.
- `/dentistas`: nome, CPF (`_id`), CRO, UF e especialidade.
- `/procedimentos`: nome, descrição, tipo e valor.
- `/secretarias`: nome.

As quatro páginas têm listagem e busca local. Este esqueleto não inclui cadastro, edição, exclusão ou autenticação.

## Dados e backend

Por padrão, usa cópias dos quatro JSONs de `backend-clinic/database`, em `src/data`, para funcionar sem MongoDB. Alterações nos JSONs originais não são sincronizadas automaticamente.

Para consultar o backend:

1. Copie `.env.example` para `.env`.
2. Altere `VITE_USE_API=true`.
3. Inicie o backend na porta 3000 e reinicie o Vite.

O proxy de desenvolvimento encaminha `/api` para `http://localhost:3000`, sem precisar modificar o CORS do backend. As rotas consultadas são `/atendimentos`, `/dentistas`, `/procedimentos` e `/secretaria` (singular). A resposta de atendimentos é extraída de `data`; as demais são arrays.

Em produção, configure um proxy `/api` no servidor de hospedagem ou defina `VITE_API_URL` com o endereço do backend e configure CORS nele. As variáveis Vite são aplicadas durante o build. `npm run preview` serve para conferir o build localmente.

Os identificadores `id` das secretárias e `idProcedimento` nos JSONs diferem dos `_id` gerados pelo MongoDB. Por isso não são usados como identificadores de escrita. O status de atendimento aceita exibição de `CONCLUÍDO` (JSON) e `CONCLUIDO` (API).

## Estrutura

- `src/pages`: uma página para cada recurso.
- `src/components/Listagem.jsx`: tabela, busca e estados de carregamento, erro e vazio.
- `src/services/api.js`: leitura local ou consulta à API e formatação.
- `src/data`: dados de demonstração.
- `src/styles.css`: estilos responsivos.
