# 🐳 Guia de Uso do Docker

Este projeto está configurado para rodar com Docker e Docker Compose.

## 📋 Pré-requisitos

- Docker instalado ([Download Docker](https://www.docker.com/get-started))
- Docker Compose instalado (geralmente vem com o Docker Desktop)

## 🚀 Como Usar

### 1. Construir e iniciar todos os serviços

```bash
docker-compose up --build
```

Este comando irá:
- Construir as imagens do backend e frontend
- Iniciar o MongoDB
- Iniciar o backend na porta 5000
- Iniciar o frontend na porta 3000

### 2. Rodar em background (detached mode)

```bash
docker-compose up -d --build
```

### 3. Parar os serviços

```bash
docker-compose down
```

### 4. Parar e remover volumes (limpar dados do MongoDB)

```bash
docker-compose down -v
```

### 5. Ver logs dos serviços

```bash
# Todos os serviços
docker-compose logs -f

# Apenas backend
docker-compose logs -f backend

# Apenas frontend
docker-compose logs -f frontend

# Apenas MongoDB
docker-compose logs -f mongodb
```

## 🌐 Acessar a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

## 🔧 Configuração

### Variáveis de Ambiente

O projeto usa as seguintes variáveis de ambiente:

**Backend:**
- `PORT`: Porta do servidor (padrão: 5000)
- `MONGO_URI`: URI de conexão do MongoDB (padrão: mongodb://mongodb:27017/fortnite)
- `JWT_SECRET`: Secret para JWT (se necessário)

**Frontend:**
- `VITE_API_URL`: URL da API do backend (padrão: http://localhost:5000)

### Modificar Variáveis

Para modificar as variáveis de ambiente, edite o arquivo `docker-compose.yml` na seção `environment` de cada serviço.

## 🛠️ Comandos Úteis

### Reconstruir apenas um serviço

```bash
docker-compose up --build backend
docker-compose up --build frontend
```

### Executar comandos dentro de um container

```bash
# Backend
docker-compose exec backend sh

# Frontend
docker-compose exec frontend sh

# MongoDB
docker-compose exec mongodb mongosh
```

### Limpar tudo (containers, imagens, volumes)

```bash
docker-compose down -v --rmi all
```

## 📁 Estrutura dos Arquivos Docker

- `backend/Dockerfile`: Configuração do container do backend
- `frontend/Dockerfile`: Configuração do container do frontend
- `frontend/nginx.conf`: Configuração do Nginx para servir o frontend
- `docker-compose.yml`: Orquestração de todos os serviços
- `backend/.dockerignore`: Arquivos ignorados no build do backend
- `frontend/.dockerignore`: Arquivos ignorados no build do frontend

## ⚠️ Notas Importantes

1. **Primeira execução**: O MongoDB criará automaticamente o banco de dados `fortnite` na primeira execução.

2. **Dados persistentes**: Os dados do MongoDB são armazenados em um volume Docker chamado `mongodb_data`, então não serão perdidos ao parar os containers.

3. **Hot Reload**: Para desenvolvimento com hot reload, é recomendado rodar os serviços localmente (fora do Docker) usando `npm run dev`.

4. **Build do Frontend**: O frontend é buildado durante a criação da imagem Docker. Se você modificar o código do frontend, precisará reconstruir a imagem.

## 🐛 Troubleshooting

### Porta já em uso

Se as portas 3000, 5000 ou 27017 já estiverem em uso, você pode modificá-las no arquivo `docker-compose.yml`.

### Erro de conexão com MongoDB

Certifique-se de que o serviço `mongodb` está rodando antes do `backend`. O `depends_on` no docker-compose já cuida disso.

### Frontend não conecta ao backend

Verifique se a variável `VITE_API_URL` no `docker-compose.yml` está correta. Lembre-se que o build do Vite acontece em build time, então você precisa reconstruir a imagem se mudar essa variável.

