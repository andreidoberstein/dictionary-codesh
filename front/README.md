# 🖥️ Dictionary Web (Frontend)

Aplicação **React + TypeScript** para consumir a **Dictionary API**. Oferece **login**, **lista de palavras com busca e scroll infinito (cursor)**, **detalhe da palavra**, **favoritos** e **histórico de visualizações**. Integra-se ao backend via **JWT** e segue boas práticas de UX, acessibilidade e performance.

---

## ✨ Diferenciais implementados

* **Scroll infinito com cursor** (consumo de `next`/`previous` da API)
* **Proxy de definições** via backend (Free Dictionary API) + exibição de **HIT/MISS** do cache quando fornecido
* **Autenticação JWT** com interceptors de requisição
* **UX**: toasts/feedbacks, loading states e empty states
* **Docker** para build/serve estático (Nginx)
* **Deploy** compatível com Railway/Vercel/Netlify (build estático)
* **Testes** (sugerido: Vitest + React Testing Library)

---

## 🚀 Tecnologias Utilizadas

* **React 18+** + **TypeScript**
* **Vite** (dev/build) ou CRA equivalente
* **React Router** (navegação)
* **Axios** (HTTP) com interceptors
* **Tailwind CSS** (estilização) *(opcional)*
* **React Helmet** (SEO/metadados) *(opcional)*

---

## 📦 Pré-requisitos

* [Node.js](https://nodejs.org/) v18+ (recomendado v20)
* [Docker](https://www.docker.com/) (opcional para deploy local)
* [Git](https://git-scm.com/)

---

## ⚙️ Como rodar o projeto

### 1) Clone o repositório

```bash
git clone https://github.com/andreidoberstein/dictionary-codesh.git
cd dictionary-codesh/front
```

### 2) Instale e rode em desenvolvimento

```bash
npm run dev
```


---

Acesse `http://localhost:8080`.

---

## 🔐 Autenticação (Fluxo no Front)

1. **Signup/Login** chama `/auth/signup` ou `/auth/signin` no backend.
2. Armazena o **JWT** (ex.: `localStorage`) e adiciona `Authorization: Bearer <token>` via **Axios interceptor**.
3. Rotas protegidas (favoritos, histórico) verificam a presença do token.

---

## 🧭 Rotas de UI (Frontend)

* `/login` – autenticação
* `/signup` – cadastro
* `/words` – listagem com **busca** e **scroll infinito**
* `/favorites` – suas palavras favoritas (paginado por página)
* `/history` – histórico de visualizações (paginado por página)
* `/words/:word?` – detalhe da palavra (página ou modal)

### Scroll Infinito (como funciona)

1. Primeira chamada: `GET /entries/en?limit=50` (sem `cursor`).
2. Salvar o `next` retornado.
3. Ao chegar ao final do container, chamar `GET /entries/en?cursor=<token>&limit=50`.
4. Repetir enquanto `hasNext` for `true`.

---

## 🔗 Integração com a API (exemplos)

**Instância Axios**

```ts
// src/integrations/api/client.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

**Lista com cursor**

```ts
export async function getWords(search?: string, cursor?: string, limit = 50) {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (cursor) params.append('cursor', cursor);
  if (limit) params.append('limit', String(limit));
  const { data } = await api.get(`/entries/en?${params.toString()}`);
  return data; // { results, totalDocs, next, previous, hasNext, hasPrev }
}
```

**Detalhe (proxy + cache)**

```ts
export async function getWordDetail(word: string) {
  const { data, headers } = await api.get(`/entries/en/${encodeURIComponent(word)}`);
  const cacheHeader = headers['x-cache']; // HIT | MISS (se disponibilizado pelo backend)
  return { data, cacheHeader };
}
```

**Favoritar / desfavoritar**

```ts
export const favoriteWord = (word: string) => api.post(`/entries/en/${word}/favorite`);
export const unfavoriteWord = (word: string) => api.delete(`/entries/en/${word}/unfavorite`);
```

**Histórico**

```ts
export const getHistory = (page = 1, limit = 10) =>
  api.get(`/user/me/history`, { params: { page, limit } }).then(r => r.data);
```

---

## 🧱 Estrutura do projeto (sugerida)

```
src/
  components/
  pages/
    Login.tsx
    Signup.tsx
    Words.tsx
    Favorites.tsx
    History.tsx
    WordDetail.tsx
  hooks/
  integrations/
    api/
      client.ts
      words.ts
      user.ts
  providers/
    AuthProvider.tsx
  styles/
  main.tsx
  router.tsx
index.html
```

---


## ☁️ Deploy

* **Vercel/Netlify**: apontar build para `npm run build` e diretório `dist`.

---

## 🔎 Processo de Investigação & Estudo

> Principais aprendizados e decisões durante o desenvolvimento do **frontend**.

### Hipóteses iniciais

* **H1:** O backend fornece **cursor pagination** confiável; o front pode orquestrar **scroll infinito** de forma fluida.
* **H2:** O detalhamento da palavra é entregue por proxy do backend; o front só renderiza e fornece UX (áudio, exemplos, favoritos).
* **H3:** Manter estado leve (sem sobrecarga de libs) é suficiente; interceptors + context de auth resolvem.

### Experimentos e aprendizados (resumo datado)

* **Documentação e padrões do ecossistema:** estudo de **React Router**, **Axios interceptors**, e guidelines de UX para **scroll infinito** (sentinel + `IntersectionObserver`).
* **Cursores no front:** modelagem do cliente para persistir `next/previous` e prevenir requisições duplicadas; tratamento de corrida ("double fire") e backpressure (debounce/threshold do observer).
* **UI/UX e acessibilidade:** skeletons, toasts, foco gerenciado após navegação, aria-labels; container rolável isolado para não rolar a página inteira.
* **Integração com cache do backend:** exibir `X-Cache: HIT/MISS` quando disponível; mensagens visuais sutis no detalhe da palavra.
* **Utilização da IA Lovable:** uso da **Lovable** para scaffolding rápido de componentes e ajustes de estilos; revisão manual para correções de tipagem, acessibilidade e performance. Ganho de velocidade, mantendo qualidade por meio de refactors e lint.

### Decisões de arquitetura (front)

* **React + Vite** com **React Router** (SPA)
* **Axios** encapsulado e interceptado para JWT
* **Padrões**: componentes puros, hooks para integração, providers para contexto
* **Estilo**: Tailwind (opcional), design responsivo e focado

---

## 💡 Autor

Desenvolvido com 💻 por **Andrei Doberstein**
