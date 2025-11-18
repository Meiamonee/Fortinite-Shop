# 🎮 Fortnite Shop - Aplicação Web de Cosméticos

Aplicação web completa para exibição, busca e compra de cosméticos do Fortnite, integrada com a API não oficial do Fortnite. Permite que usuários visualizem todos os cosméticos disponíveis, filtrem por diversos critérios, comprem itens com créditos (v-bucks) e gerenciem seu inventário.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Como Rodar o Projeto](#-como-rodar-o-projeto)
  - [Usando Docker (Recomendado)](#usando-docker-recomendado)
  - [Sem Docker](#sem-docker)
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
- **Nginx** - Servidor web para servir o frontend em produção

## 📦 Pré-requisitos

### Para rodar com Docker:
- Docker Desktop instalado e rodando
- Docker Compose (geralmente incluído no Docker Desktop)

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

### Sem Docker

#### Backend

1. **Entre na pasta do backend:**
   ```bash
   cd backend
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` na pasta `backend` com:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/fortnite
   NODE_ENV=development
   ```

4. **Certifique-se de que o MongoDB está rodando**

5. **Inicie o servidor:**
   ```bash
   npm run dev
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

### 1. **Arquitetura Monolítica com Separação Frontend/Backend**
- **Decisão:** Separar frontend e backend em projetos distintos, mas mantê-los no mesmo repositório
- **Motivo:** Facilita desenvolvimento, deploy independente e manutenção do código

### 2. **MongoDB como Banco de Dados**
- **Decisão:** Utilizar MongoDB (NoSQL) ao invés de SQL
- **Motivo:** 
  - Estrutura flexível para cosméticos com campos variáveis
  - Facilita relacionamentos entre usuários e cosméticos
  - Boa integração com Node.js através do Mongoose

### 3. **Sincronização Automática com Cron Jobs**
- **Decisão:** Implementar sincronização automática a cada 6 horas usando `node-cron`
- **Motivo:** 
  - Mantém os dados atualizados sem intervenção manual
  - Garante que status (novo/loja) estejam sempre corretos
  - Executa sincronização na inicialização do servidor

### 4. **Sistema de Status para Cosméticos**
- **Decisão:** Usar campo `status` com valores: "normal", "novo", "loja"
- **Motivo:** 
  - Permite identificar facilmente cosméticos novos e à venda
  - Facilita filtros e queries no banco de dados
  - Reset automático antes de cada sincronização

### 5. **Bundles como Cosméticos Especiais**
- **Decisão:** Tratar bundles como cosméticos com flag `isBundle` e array `bundleItems`
- **Motivo:** 
  - Reutiliza a mesma estrutura de dados
  - Facilita compra/reembolso de bundles
  - Mantém consistência no sistema

### 6. **Frontend com React e Vite**
- **Decisão:** Usar React 19 com Vite ao invés de Create React App
- **Motivo:** 
  - Vite oferece build mais rápido
  - Melhor experiência de desenvolvimento
  - Suporte nativo a ES modules

### 7. **Docker para Deploy**
- **Decisão:** Containerizar toda a aplicação com Docker
- **Motivo:** 
  - Facilita execução local e deploy
  - Garante ambiente consistente
  - Isola dependências (MongoDB, Node.js, Nginx)

### 8. **Nginx para Frontend em Produção**
- **Decisão:** Usar Nginx para servir o frontend buildado
- **Motivo:** 
  - Melhor performance que servidor de desenvolvimento
  - Configuração simples e eficiente
  - Padrão da indústria para SPAs

### 9. **Armazenamento Local (localStorage) para Autenticação**
- **Decisão:** Usar localStorage para armazenar dados do usuário logado
- **Motivo:** 
  - Simplicidade de implementação
  - Não requer gerenciamento de estado global complexo
  - Adequado para MVP

### 10. **Filtros no Frontend**
- **Decisão:** Implementar filtros no frontend (client-side)
- **Motivo:** 
  - Melhor performance para filtros simples
  - Reduz carga no servidor
  - Experiência mais responsiva para o usuário

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

## 🔒 Segurança

**Nota:** Esta é uma aplicação de demonstração. Para produção, recomenda-se:
- Hash de senhas (bcrypt)
- Autenticação JWT
- Validação de entrada mais rigorosa
- Rate limiting
- HTTPS

## 📝 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

## 👨‍💻 Autor

Desenvolvido como projeto de avaliação técnica.

---

**Última atualização:** Novembro 2025

