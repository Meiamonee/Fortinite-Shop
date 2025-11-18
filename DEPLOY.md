# 🚀 Guia de Deploy - Render + Vercel

## 📋 Configuração do Backend (Render)

### 1. Variáveis de Ambiente no Render

Configure estas variáveis no painel do Render:

```
MONGO_URI=mongodb+srv://meiamonebr_db_user:FmqDbe7dKqLNxCbu@cluster0.b3n9ffw.mongodb.net/fortniteshop?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=production
FRONTEND_URL=https://seu-frontend.vercel.app
PORT=5000
```

**Importante:**
- A connection string já está configurada com o banco `fortniteshop`
- Substitua `https://seu-frontend.vercel.app` pela URL real do seu frontend no Vercel
- O Render define a porta automaticamente, mas o PORT serve como fallback

### 2. Build Command no Render

```
npm install
```

### 3. Start Command no Render

```
npm start
```

### 4. Root Directory

```
backend
```

---

## 📋 Configuração do Frontend (Vercel)

### 1. Variáveis de Ambiente no Vercel

Configure esta variável no painel do Vercel:

```
VITE_API_URL=https://seu-backend.onrender.com
```

**Importante:**
- Substitua `https://seu-backend.onrender.com` pela URL real do seu backend no Render
- A URL será algo como: `https://fortnite-shop-backend.onrender.com`

### 2. Build Command no Vercel

```
npm run build
```

### 3. Output Directory

```
dist
```

### 4. Root Directory

```
frontend
```

---

## 📝 Passo a Passo

### Backend no Render:

1. Acesse [render.com](https://render.com) e faça login
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório do GitHub
4. Configure:
   - **Name:** `fortnite-shop-backend` (ou o nome que preferir)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Root Directory:** `backend`
5. Adicione as variáveis de ambiente (veja acima)
6. Clique em "Create Web Service"
7. Aguarde o deploy e copie a URL gerada (algo como `https://fortnite-shop-backend.onrender.com`)

### Frontend no Vercel:

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New..." → "Project"
3. Conecte seu repositório do GitHub
4. Configure:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Adicione a variável de ambiente:
   - `VITE_API_URL` = URL do seu backend no Render
6. Clique em "Deploy"
7. Aguarde o deploy e copie a URL gerada

### Atualizar CORS no Backend:

Depois que o frontend estiver no ar, volte ao Render e atualize a variável:

```
FRONTEND_URL=https://sua-url-real-do-vercel.vercel.app
```

Isso permitirá que o backend aceite requisições do frontend.

---

## ✅ Checklist Final

- [ ] Backend deployado no Render
- [ ] Variáveis de ambiente configuradas no Render
- [ ] URL do backend copiada
- [ ] Frontend deployado no Vercel
- [ ] Variável `VITE_API_URL` configurada no Vercel com a URL do Render
- [ ] Variável `FRONTEND_URL` atualizada no Render com a URL do Vercel
- [ ] Testado se o frontend consegue se comunicar com o backend

---

## 🔧 Troubleshooting

### Erro de CORS
- Verifique se `FRONTEND_URL` no Render está com a URL correta do Vercel
- Certifique-se de que não há barra `/` no final da URL

### Erro de conexão com MongoDB
- Verifique se a connection string está correta no Render
- Verifique se o IP do Render está liberado no MongoDB Atlas (Network Access)
- A connection string deve ter `/fortniteshop` antes do `?`
- No MongoDB Atlas, vá em "Network Access" e adicione `0.0.0.0/0` para permitir qualquer IP (ou adicione o IP específico do Render)

### Frontend não carrega dados
- Verifique se `VITE_API_URL` está configurada corretamente no Vercel
- Verifique se o backend está rodando (acesse a URL do Render no navegador)
- Verifique o console do navegador para erros

