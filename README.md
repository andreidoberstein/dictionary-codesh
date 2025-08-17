# 🧭 Apresentação do Repositório
![Preview da aplicação](./img/dic_front.png)

Este repositório contém o **teste técnico (Coodesh)** de um Dicionário de Palavras em inglês, composto por **backend (NestJS)** e **frontend (React/TypeScript)**.


> **Importante:** Os guias completos de instalação, execução e deploy estão nos READMEs específicos de cada parte do projeto:
>
> * **Backend (API)** → [`/server/README.md`](server/README.md)
> * **Frontend (Web)** → [`/front/README.md`](front/README.md)

---

## 🌿 Branches & ambientes

- **dev**: versão para **testar localmente** (desenvolvimento).
- **main**: branch de **deploy/produção**.
[`https://dictionary-codesh-oo8155lnd-andreivupts-projects.vercel.app/login`]()

**Comandos úteis**

```bash
git checkout dev   # trabalhar/testar local
# ...
git checkout main  # acompanhar versão de produção
```

---

## 🌳 Estrutura



```
.
├── front/   # Aplicação web (React + TS)
├── server/  # API (NestJS + Prisma + PostgreSQL)
└── README.md (este arquivo)
```

---

## 🚀 Como começar

1. **Clone** o repositório: `git clone <URL_DO_REPOSITORIO>`
2. Acesse cada pasta e siga o respectivo README:

   * API: [`server/README.md`](server/README.md)
   * Web: [`front/README.md`](front/README.md)

> Observação: Este README é apenas de **apresentação**. As instruções detalhadas (variáveis de ambiente, Docker, testes, Swagger, etc.) estão nos READMEs das pastas **front** e **server**.

---

## 🧩 Tecnologias (visão geral)

* **Backend:** NestJS, Prisma, PostgreSQL, JWT, Swagger, Docker
* **Frontend:** React, TypeScript, Vite, Axios, Tailwind (opcional)
* **Infra/Extras:** Docker Compose, Railway (deploy), Redis (cache)



---

>  This is a challenge by [Coodesh](https://coodesh.com/)
