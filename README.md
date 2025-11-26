```markdown
# Streamer API (Postgres)

Refatorado para usar PostgreSQL (Render). O app suporta:
- cadastro/login de usuários (JWT)
- cadastro/edição/remoção de streams (title, summary, url, tags, owner)
- busca por texto em title/summary/tags, filtros e paginação
- criação automática das tabelas na inicialização

Observação: este projeto é um protótipo. Em produção configure secrets, HTTPS, rate-limiting, validação e monitoração.

Configuração
1. Crie um arquivo .env na raiz (copie .env.example):
   - No PowerShell:
     copy .env.example .env
   - No Linux/macOS:
     cp .env.example .env

2. Cole a sua connection string (Render) em DATABASE_URL no .env.
   Exemplo (sua string):
   DATABASE_URL=postgresql://streamdb_b1wx_user:Sr8r2bSUPVqCWWIKscL8RRURKmpzcVJu@dpg-d4j45d0bdp1s73flk900-a.oregon-postgres.render.com/streamdb_b1wx

3. Defina um JWT_SECRET sólido:
   JWT_SECRET=uma_string_muito_forte_e_aleatoria

Instalação
npm install

Rodando
npm start
ou em dev:
npm run dev

Endpoints (resumo)
- POST /auth/register
  - body: { username, password, name? }
- POST /auth/login
  - body: { username, password } -> returns { token }
- GET /auth/me (requires Bearer token)
- POST /streams (Bearer token) - create
- PUT /streams/:id (Bearer token, owner only) - update
- DELETE /streams/:id (Bearer token, owner only) - delete
- GET /streams - list/search/pagination
- GET /streams/:id - get details

Observações importantes sobre Render/Postgres
- Render Postgres usually requires SSL. The connection pool is configured with ssl.rejectUnauthorized=false to allow connection from many hosts.
- Don't commit real secrets into source control. Use Render environment variables for DATABASE_URL and JWT_SECRET in production.

Próximos passos recomendados
- Add input validation with Joi or Zod.
- Add rate limiting (express-rate-limit) and login throttling.
- Add tests and CI.
- Migrate to a proper migration tool (e.g., node-pg-migrate, knex migrations) for production DB changes.
- Consider storing tags in a separate table if you need tag relationships and indexing for large datasets.

```