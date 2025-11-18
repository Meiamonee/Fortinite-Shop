# 🎮 Fortnite Shop - Aplicação Web de Cosméticos

Aplicação web completa para exibição, busca e compra de cosméticos do Fortnite, integrada com a API não oficial do Fortnite. Permite que usuários visualizem todos os cosméticos disponíveis, filtrem por diversos critérios, comprem itens com créditos (v-bucks) e gerenciem seu inventário.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
  -[Usando Docker (Recomendado)](#usando-docker-recomendado)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Decisões Técnicas](#-decisões-técnicas)
- [API Externa](#-api-externa)
- [Endpoints da API](#-endpoints-da-api)

## ✨ Funcionalidades

### 🔹 Acesso Público
- ✅ Visualização de todos os cosméticos sem necessidade de login
- ✅ Busca e filtros avançados (nome, tipo, raridade, data, status)
- ✅ Paginação de resultados
- ✅ Visualização de detalhes completos de cada cosmético
- ✅ Páginas públicas de perfis de usuários

### 🔹 Sistema de Autenticação
- ✅ Cadastro de usuário com e-mail e senha
- ✅ Login de usuário
- ✅ Crédito inicial de 10.000 v-bucks para novos usuários

### 🔹 Sistema de Compras
- ✅ Compra de cosméticos individuais
- ✅ Compra de bundles (marca todos os itens como adquiridos)
- ✅ Validação de créditos suficientes
- ✅ Prevenção de compra duplicada
- ✅ Reembolso de cosméticos a qualquer momento
- ✅ Histórico completo de compras e reembolsos

### 🔹 Indicadores Visuais
- ✅ Badge "NOVO" para cosméticos recém-lançados
- ✅ Badge "À VENDA" para itens disponíveis na loja
- ✅ Badge "PROMOÇÃO" para itens com desconto
- ✅ Badge "ADQUIRIDO" para itens já comprados pelo usuário
- ✅ Badge "BUNDLE" para pacotes de itens

### 🔹 Sincronização Automática
- ✅ Sincronização automática com API Fortnite a cada 6 horas
- ✅ Sincronização na inicialização do servidor
- ✅ Atualização de status (novo/loja) dos cosméticos

## 🛠 Tecnologias Utilizadas

### Frontend
- **React 19.1.1** - Biblioteca JavaScript para construção de interfaces
- **React Router DOM 7.9.5** - Roteamento de páginas
- **Vite 7.1.7** - Build tool e dev server
- **Axios 1.13.2** - Cliente HTTP para requisições à API
- **CSS3** - Estilização customizada

### Backend
- **Node.js 20** - Runtime JavaScript
- **Express 5.1.0** - Framework web para Node.js
- **MongoDB 7** - Banco de dados NoSQL
- **Mongoose 8.19.2** - ODM (Object Data Modeling) para MongoDB
- **Axios 1.13.1** - Cliente HTTP para integração com API externa
- **Node-cron 4.2.1** - Agendamento de tarefas (sincronização automática)
- **CORS 2.8.5** - Middleware para permitir requisições cross-origin
- **dotenv 17.2.3** - Gerenciamento de variáveis de ambiente
- **jsonwebtoken 9.0.2** - Autenticação via JWT (preparado para uso futuro)

### DevOps
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de múltiplos containers
- 
## 📦 Pré-requisitos

### Para rodar com Docker:
- Docker Desktop instalado e rodando
- Docker Compose 

### Para rodar sem Docker:
- Node.js 20 ou superior
- MongoDB 7 ou superior (ou MongoDB Atlas)
- npm ou yarn

## 🚀 Como Rodar o Projeto

### Usando Docker (Recomendado)

1. **Clone o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd Fortinite-Shop
   ```

2. **Certifique-se de que o Docker Desktop está rodando**

3. **Execute o docker-compose:**
   ```bash
   docker-compose up --build
   ```

4. **Acesse a aplicação:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - MongoDB: localhost:27017

5. **Para parar os containers:**
   ```bash
   docker-compose down
   ```

6. **Para parar e remover volumes (limpa dados do MongoDB):**
   ```bash
   docker-compose down -v
   ```

#### Frontend

1. **Entre na pasta do frontend:**
   ```bash
   cd frontend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a URL da API:**
   Crie um arquivo `.env` na pasta `frontend` com:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação:**
   - Frontend: http://localhost:5173 (porta padrão do Vite)

## 📁 Estrutura do Projeto

```
Fortinite-Shop/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # Configuração do MongoDB
│   │   ├── controladores/
│   │   │   ├── AuthControlador.js      # Autenticação (login/cadastro)
│   │   │   ├── CompraControlador.js    # Compras e reembolsos
│   │   │   ├── CosmeticoControlador.js # CRUD de cosméticos e sincronização
│   │   │   └── UsuarioControlador.js   # Gestão de usuários
│   │   ├── models/
│   │   │   ├── Cosmeticos.js     # Modelo de cosmético
│   │   │   ├── Historico.js      # Modelo de histórico
│   │   │   └── Usuario.js        # Modelo de usuário
│   │   ├── rotas/
│   │   │   ├── authRotas.js      # Rotas de autenticação
│   │   │   ├── CompraRotas.js    # Rotas de compras
│   │   │   ├── CosmeticoRotas.js # Rotas de cosméticos
│   │   │   └── UsuarioRotas.js   # Rotas de usuários
│   │   └── server.js             # Servidor Express principal
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── CosmeticoCard.jsx # Card de exibição de cosmético
│   │   │   ├── Navbar.jsx        # Barra de navegação
│   │   │   └── Paginacao.jsx     # Componente de paginação
│   │   ├── pages/
│   │   │   ├── CosmeticoDetalhe.jsx # Página de detalhes
│   │   │   ├── Historico.jsx     # Histórico de compras
│   │   │   ├── Login.jsx         # Login/Cadastro
│   │   │   ├── Loja.jsx          # Página principal (loja)
│   │   │   ├── PerfilPublico.jsx # Perfil público de usuário
│   │   │   └── UsuariosPublicos.jsx # Lista de usuários
│   │   ├── services/
│   │   │   └── api.js            # Configuração do Axios
│   │   ├── style/                # Arquivos CSS
│   │   ├── App.jsx               # Componente principal
│   │   └── main.jsx              # Entry point
│   ├── Dockerfile
│   ├── nginx.conf                # Configuração do Nginx
│   └── package.json
│
├── docker-compose.yml             # Configuração Docker Compose
└── README.md                      # Este arquivo
```

## 🎯 Decisões Técnicas

> Muitas decisões abaixo foram tomadas em função dos requisitos do desafio (frontend + backend, integração com a API externa, sincronização periódica dos endpoints `/cosmetics/new` e `/shop`).

### 1. **Arquitetura com Separação Frontend/Backend**
- **Decisão:** Frontend e backend em pastas separadas dentro do mesmo repositório.
- **Motivo:**  
  - O exercício exige frontend + backend entregues juntos; manter no mesmo repositório facilita a avaliação.  
  - Separar em pastas distintas permite deploy independente e organização clara sem a complexidade de microserviços.  
  - Facilita a configuração do Docker Compose para rodar tudo localmente para o avaliador.

---

### 2. **MongoDB como Banco de Dados**
- **Decisão:** Utilizar MongoDB com Mongoose.
- **Motivo:**  
  - Escolha alinhada à minha maior familiaridade, o que acelerou a entrega e reduziu riscos durante a avaliação.  
  - Por ser uma entrega para avaliação, criar *models* diretamente no código foi mais prático do que montar estruturas SQL/DDL manualmente.  
  - A estrutura flexível do MongoDB facilita armazenar cosméticos (campos variáveis, bundles, metadados da API externa) e sincronizações periódicas sem migrações complexas.

---

### 3. **Sincronização Automática **
- **Decisão:** Agendar sincronização a cada 6 horas com `node-cron` e também executar sincronização na inicialização.
- **Motivo:**  
  - A API externa atualiza `/cosmetics/new` e `/shop` periodicamente; a sincronização automatizada esse processo .  
  - Automatizar evita depender de atualizações de dados manualmente.  
  - Executar na inicialização garante dados minimamente atualizados ao rodar o projeto localmente.

---

### 4. **Sistema de Status para Cosméticos**
- **Decisão:** Campo `status` com valores: `"normal"`, `"novo"`, `"loja"`.
- **Motivo:**  
  - Requisito do front (ícones visuais para novo/à venda/adquirido) demanda metadados fáceis de consultar.  
  - Facilita filtros, paginação e exibição condicional em qualquer lista ou detalhe de cosmético.  
  - Antes de cada sincronização, os status são resetados/atualizados para evitar dados inconsistentes.

---

### 5. **Bundles como Cosméticos Especiais**
- **Decisão:** Tratar bundles como cosméticos com `isBundle: true` e `bundleItems: [...]`.
- **Motivo:**  
  - Requisito: comprar um bundle marca todos os itens como adquiridos. Modelar bundles dentro do mesmo esquema simplifica essa lógica.  
  - Evita duplicação de entidades e facilita histórico de compras / reembolsos.  
  - Mantém consistência entre listagens da API externa e a representação interna.

---

### 6. **Frontend com React e Vite**
- **Decisão:** Frontend em React (v19) com Vite.
- **Motivo:**  
  - Atende ao requisito de uma SPA responsiva e facilita paginar/exibir imagens de cosméticos.  
  - Vite acelera o desenvolvimento e o build, o que foi importante para entregar a tempo.  
  - Ecossistema React facilita implementação de filtros, paginação e componentes reutilizáveis (cards, modais de detalhe, ícones de status).

---

### 7. **Docker para Entregável**
- **Decisão:** Containerizar a aplicação (backend, frontend e serviço de apoio) com Docker / Docker Compose.
- **Motivo:**  
  - Pedido explícito no enunciado: facilitar execução local.  
  - Garante ambiente previsível (Node, MongoDB) sem necessidade de instalações manuais.  
  - Facilita testes automatizados no ambiente replicável.

---

### 8. Armazenamento Local (localStorage) para Autenticação — abordagem simples e funcional
**Decisão:** Os dados essenciais do usuário (como token e informações mínimas) são armazenados no `localStorage` para manter a sessão ativa no lado do cliente.
**Motivo:**  
- Como o projeto foi pensado para ser **simples e funcional**, utilizei o `localStorage` para facilitar a avaliação e evitar configurações mais complexas de autenticação.
- O site pode ser acessado sem login; a autenticação é necessária apenas no momento da compra.  
- Usar `localStorage` reduz a complexidade de implementação e elimina a necessidade de um sistema de sessões mais avançado, mantendo o fluxo de navegação leve e direto.

---

### 9. **Filtros no Frontend (com suporte a queries no backend)**
- **Decisão:** Implementar filtros responsivos no cliente (nome, tipo, raridade, novo/à venda/promo) e complementar com endpoints backend quando necessário (ex.: paginação e filtros por intervalo de datas).
- **Motivo:**  
  - Requisito pede buscas por vários critérios — implementar os filtros client-side garante experiência instantânea para o avaliador.  
  - Para datasets maiores e para filtros por intervalo de datas (que podem ser custosos), há suporte de query no backend para delegar o trabalho e manter paginação eficiente.  
  - Equilíbrio entre responsividade UX e escalabilidade: client-side para rapidez; backend para operações pesadas/paginadas.

---

## 🌐 API Externa

A aplicação integra com a API não oficial do Fortnite:
- **Base URL:** `https://fortnite-api.com/v2`
- **Endpoints utilizados:**
  - `/cosmetics/br` - Lista todos os cosméticos
  - `/cosmetics/new` - Lista cosméticos novos
  - `/shop` - Lista cosméticos à venda (loja atual)

**Documentação:** https://dash.fortnite-api.com/

## 📡 Endpoints da API

### Autenticação
- `POST /auth/registrar` - Cadastrar novo usuário
- `POST /auth/login` - Fazer login

### Cosméticos
- `GET /cosmeticos` - Listar todos os cosméticos
- `GET /cosmeticos/shop` - Listar cosméticos à venda
- `GET /cosmeticos/new` - Listar cosméticos novos
- `GET /cosmeticos/filtrar` - Filtrar cosméticos (query params)

### Compras
- `POST /compras/comprar` - Comprar um cosmético
- `POST /compras/reembolso` - Reembolsar um cosmético
- `GET /compras/historico/:usuarioId` - Histórico de transações

### Usuários
- `GET /usuarios` - Listar todos os usuários
- `GET /usuarios/publicos` - Listar usuários (público)
- `GET /usuarios/:id/cosmeticos` - Cosméticos de um usuário

## 👨‍💻 Autor

Pedro Lucas de Souza Faria

---

**Última atualização:** Novembro 2025

