# 📚 Dictionary API

API REST para um dicionário de palavras em inglês, desenvolvida com **NestJS**, **Prisma**, **Docker** e autenticação **JWT**. A aplicação oferece **login**, **lista com busca e paginação por cursor (suporte a scroll infinito no front)**, **histórico de palavras visualizadas**, **favoritos** e **proxy** para a **Free Dictionary API**, com documentação automática via **Swagger**.


---

## 📋 Checklist de Requisitos

### Requisitos obrigatórios
- [x] Como usuário, devo ser capaz de realizar login com usuário e senha
- [x] Como usuário, devo ser capaz de visualizar a lista de palavras do dicionário
- [x] Como usuário, devo ser capaz de guardar no histórico palavras já visualizadas
- [x] Como usuário, devo ser capaz de visualizar o histórico de palavras já visualizadas
- [x] Como usuário, deve ser capaz de guardar uma palavra como favorita
- [x] Como usuário, deve ser capaz de apagar uma palavra favorita
- [x] Internamente, a API deve fazer proxy da API Free Dictionary, pois assim o front irá acessar somente a sua API

---

### Requisitos diferenciais
- [x] Diferencial 1 – Descrever a documentação da API utilizando o conceito de **OpenAPI 3.0**
- [x] Diferencial 2 – Escrever **Unit Tests** para os endpoints da API
- [x] Diferencial 3 – Configurar **Docker** no projeto para facilitar o deploy
- [x] Diferencial 4 – **Deploy** em servidor (com ou sem CI)
- [x] Diferencial 5 – Implementar paginação com **cursores** em vez de **page/limit**
- [x] Diferencial 6 – **Cache** das requisições ao Free Dictionary (HIT/MISS)


## 🚀 Tecnologias Utilizadas

* **NestJS** – Framework escalável para Node.js
* **Prisma** – ORM moderno e eficiente
* **PostgreSQL** – Banco de dados relacional
* **Redis** – Cache para detalhes de palavras (HIT/MISS)
* **Docker & Docker Compose** – Containerização e orquestração
* **JWT** – Autenticação
* **Swagger** – Documentação
* **Jest + Supertest** – Testes unitários e e2e

---

## 📦 Pré-requisitos

* [Node.js](https://nodejs.org/) v20 ou superior
* [Docker](https://www.docker.com/)
* [Docker Compose](https://docs.docker.com/compose/)
* [Git](https://git-scm.com/)

---

## ⚙️ Como rodar o projeto

### 1) Clone o repositório

```bash
git clone https://github.com/andreidoberstein/dictionary-codesh.git
cd dictionary-codesh/server
```

### 2) Crie o `.env` com base no `.env.example`

```bash
cp .env.example .env
```

Preencha as variáveis:

```env
PORT=3030
DATABASE_URL="postgresql://user:password@localhost:5432/dictionary_db?schema=public"
JWT_SECRET="sua-chave-secreta"
REDIS_URL="redis://localhost:6379"
```

### 3) Suba os containers com Docker

```bash
docker compose up -d
```

### 4) Rode as migrations do Prisma

```bash
npx prisma migrate dev
```

### 5) Rode o generate do Prisma

```bash
npx prisma generate
```

### 6) Popular o banco com a lista de palavras

```bash
npm run import:words
```

### 7) Acesse a documentação Swagger

```
http://localhost:3030/api
```

## 🔐 Autenticação

Use os endpoints de **signup/signin** para obter um JWT e envie nas rotas autenticadas:

```
Authorization: Bearer <token>
```

* `POST /auth/signup` – cadastro
* `POST /auth/signin` – login


---

## 📌 Endpoints principais (Rotas pré-definidas)

### 🔑 Autenticação

* `POST /signup` – Registrar novo usuário
* `POST /signin` – Login e obtenção do token JWT

### 📖 Dicionário

* `GET /entries/en` – **Listar/pesquisar palavras** (suporte a **cursor**). Query params:

  * `search?`, `cursor?`, `limit?`
  * **Resposta:**

    ```json
    {
      "results": ["abandon", "ability", "able"],
      "totalDocs": 12345,
      "previous": null,
      "next": "eyJ0ZXh0IjoiYWJsZSJ9",
      "hasNext": true,
      "hasPrev": false
    }
    ```
* `GET /entries/en/:word` – **Detalhe da palavra** (proxy p/ Free Dictionary + **cache Redis** com `X-Cache: HIT|MISS`)
* `POST /entries/en/:word/favorite` – **Curtir/favoritar** (autenticado)
* `DELETE /entries/en/:word/unfavorite` – **Remover dos favoritos** (autenticado)

### 👤 Usuário

* `GET /user/me` – Perfil do usuário (autenticado)
* `GET /user/me/history` – **Histórico de palavras visualizadas** (autenticado)
* `GET /user/me/favorites` – **Lista de favoritas** com paginação por **página** (autenticado)

---

## 🧭 Como consumir com scroll infinito (frontend)

1. Faça `GET /entries/en?limit=50` sem `cursor` para a primeira página.
2. Armazene o `next` retornado; quando o usuário chegar ao fim da lista, chame:

   ```
   GET /entries/en?cursor=<token>&limit=50
   ```
3. Repita enquanto `hasNext` for `true`.

---

## 🗂️ Estrutura do projeto

```
prisma/
  schema.prisma
src/
  auth/
  common/
  dictionary/
  prisma/
  redis/
  scripts/
  users/
  words/
test/
  dictionary
Dockerfile
docker-compose.yml
.env.example
```

---

## ✅ Testes Unitários

Os testes estão em `test/` e cobrem os endpoints:

```bash
npm run test
```

Utiliza **Jest**, com mocks para a Free Dictionary API.

---


## 🧱 Modelagem (Prisma)

```json
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DEV_DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      String   @default("USER")

  favorities    Favorite[]
  wordHistories WordHistories[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("users")
}

model Word {
  id        String   @id @default(uuid())
  text      String   @unique

  histories WordHistories[]
  
  createdAt DateTime @default(now())

  @@map("words")
}

model WordHistories {
  id      String @id @default(uuid())
  wordId  String
  userId  String

  accessedAt DateTime @default(now())

  word    Word @relation(fields: [wordId], references: [id])
  user    User @relation(fields: [userId], references: [id])

  @@map("histories")
}

model Favorite {
  id        String   @id @default(uuid())
  userId    String
  word      String
  createdAt DateTime @default(now())

  user      User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, word])

  @@map("favorities")
}

```

---

## 🧰 Scripts úteis

```json
{
  "build": "nest build",
  "start": "nest start",
  "start:dev": "nest start --watch",
  "start:debug": "nest start --debug --watch",
  "start:prod": "node dist/main",
  "test": "jest",
  "import:words": "node dist/scripts/import-words.js --limit=5000",
  "prisma:gen": "prisma generate",
  "prisma:migrate:deploy": "prisma migrate deploy",
  "prestart:prod": "prisma generate",
  "start:railway": "npm run prisma:migrate:deploy && npm run start:prod"
}
```

---

## 🔎 Processo de Investigação & Estudo

### Hipóteses iniciais

* **H1:** `english.txt`
* **H2:** Detalhes (definições/fonética) via **Free Dictionary API** em tempo de requisição.
* **H3:** **Cursor pagination** para palavras e **page-based** para recursos do usuário.
* **H4:** JWT **Bearer**.

### Experimentos e aprendizados

- Utilização da documentação do framework:**consulta sistemática às docs oficiais do **NestJS** (módulos, providers, guards, interceptors, pipes e `@nestjs/swagger`), **Prisma** (migrations, índices únicos, paginação) e **Swagger/OpenAPI** para alinhar contratos. Principais decisões foram justificadas com base nessas referências.
- Estudo sobre utilização e aplicação de cursor:**definição de **cursor pagination** para `/entries/en` com ordenação estável por `text ASC`, geração de token **base64** contendo a última posição e suporte a `previous/next`. Direciona o **scroll infinito** no frontend.
- Aplicação de cache com Redis e ioredis:**implementação de cache para **detalhe da palavra** utilizando **ioredis**. Convenção de chaves `word:detail:{term}`, TTL configurável, invalidação simples e cabeçalho `X-Cache: HIT|MISS`. Fallback seguro quando `REDIS_URL` ausente.
- Aprofundamento em testes unitários:**estratégia de **mocks** para a Free Dictionary API, testes de services e controllers com **Jest**, e testes **e2e** com **Supertest** cobrindo autenticação, lista por cursor e cache (assert no `X-Cache`).
- Desafios com soluções para o deploy:**ajustes no **Railway** (variáveis de ambiente como `DATABASE_URL`, comando `prisma migrate deploy`, healthcheck em `/health`) e no ambiente **Docker/WSL2** (volumes, `wsl --shutdown`, rebuild). Documentado no README para reprodutibilidade.

### Decisões de arquitetura

* Monólito modular NestJS (Controller → Service → Repository) + DTOs.
* Prisma/PostgreSQL
* Provider HTTP para Free Dictionary, desacoplado.
* Erros 200/204/400 com mensagens humanizadas.

---
## 📌 Referência

>  This is a challenge by [Coodesh](https://coodesh.com/)
