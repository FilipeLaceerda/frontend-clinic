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

As quatro páginas consultam a API via HTTP, sem fallback para JSONs locais. A busca filtra os registros recebidos da API no navegador.

1. Inicie o backend na porta 3000, com a conexão ao MongoDB funcionando.
2. Inicie o frontend com `npm run dev`.

Não é necessário criar um `.env` para desenvolvimento local. Para personalizar o endereço, copie `.env.example` para `.env` e ajuste `VITE_API_URL`. A antiga variável `VITE_USE_API` não é mais utilizada.

O proxy de desenvolvimento encaminha `/api` para `http://localhost:3000`, sem precisar modificar o CORS do backend. As rotas consultadas são `/atendimentos`, `/dentistas`, `/procedimentos` e `/secretaria` (singular). A resposta de atendimentos é extraída de `data`; as demais são arrays.

Em produção, configure um proxy `/api` no servidor de hospedagem ou defina `VITE_API_URL` com o endereço do backend e configure CORS nele. As variáveis Vite são aplicadas durante o build. `npm run preview` serve para conferir o build localmente.

## Estrutura

- `src/pages`: uma página para cada recurso.
- `src/components/Listagem.jsx`: tabela, busca e estados de carregamento, erro e vazio.
- `src/services/api.js`: cliente Axios compartilhado, com endereço base e timeout.
- `src/services/*Service.js`: chamadas HTTP de cada recurso.
- `src/utils/formatadores.js`: formatação de datas e valores.
- `src/styles.css`: estilos responsivos.

## Serviços HTTP (Axios)

Cada página usa a função `listar` do seu serviço. Os métodos de escrita estão disponíveis para futuros formulários; a interface continua sendo de consulta.

| Serviço | Rota base | Consulta individual | Atualização |
| --- | --- | --- | --- |
| `atendimentoService.js` | `/atendimentos` | `buscarPorId(id)` | PATCH |
| `dentistaService.js` | `/dentistas` | `buscarPorCpf(cpf)` | PUT |
| `procedimentoService.js` | `/procedimentos` | `buscarPorId(id)` | PATCH |
| `secretariaService.js` | `/secretaria` | `buscarPorId(id)` | PATCH |

Todos exportam `listar(params = {}, signal)`, `criar(dados)`, `atualizar(idOuCpf, dados)` e `excluir(idOuCpf)`. Secretárias também exporta `buscarPorNome(nome, signal)`, que chama `GET /secretaria/buscar`.

`listar` aceita `{ observacao }` para atendimentos e `{ nome }` para os outros recursos. O `signal` é opcional e permite cancelar consultas. Os serviços retornam diretamente os registros, extraindo os envelopes `data` e `procedimento` do backend. `excluir` resolve sem retorno; falhas são propagadas como erros Axios.

Use o `_id` do MongoDB nas operações por ID; em dentistas, o `_id` corresponde ao CPF. Envie apenas os campos aceitos pelo backend nos dados de cadastro/edição.

```js
import * as dentistaService from './services/dentistaService';

const dentistas = await dentistaService.listar({ nome: 'Maria' });
const dentista = await dentistaService.buscarPorCpf('10101010101');
```
