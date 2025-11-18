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

**IMPORTANTE - Leia com atenção:**
- **Cole a connection string EXATAMENTE como está acima** (com a senha e tudo)
- **NÃO adicione espaços ou quebras de linha** na variável MONGO_URI
- **Verifique se não há espaços antes ou depois** do sinal de `=`
- Substitua `https://seu-frontend.vercel.app` pela URL real do seu frontend no Vercel
- O Render define a porta automaticamente, mas o PORT serve como fallback
- **No MongoDB Atlas**: Vá em "Network Access" e adicione `0.0.0.0/0` para permitir qualquer IP

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

**Erro: `connect ECONNREFUSED ::1:27017` ou `connect ECONNREFUSED 127.0.0.1:27017`**

Isso significa que a variável `MONGO_URI` não está sendo lida. Siga estes passos:

1. **No Render, vá em "Environment" e verifique:**
   - A variável `MONGO_URI` está definida?
   - Não há espaços antes ou depois do `=`
   - A connection string está completa (começa com `mongodb+srv://`)
   - Clique em "Save Changes" se fez alguma alteração

2. **Verifique os logs do Render:**
   - Procure por: `MONGO_URI definida: false`
   - Se aparecer `false`, a variável não está configurada corretamente

3. **Formato correto da variável no Render:**
   ```
   Key: MONGO_URI
   Value: mongodb+srv://meiamonebr_db_user:FmqDbe7dKqLNxCbu@cluster0.b3n9ffw.mongodb.net/fortniteshop?retryWrites=true&w=majority&appName=Cluster0
   ```
   - **NÃO** use aspas
   - **NÃO** adicione espaços
   - Cole exatamente como está acima

4. **No MongoDB Atlas:**
   - Vá em "Network Access"
   - Clique em "Add IP Address"
   - Selecione "Allow Access from Anywhere" (0.0.0.0/0)
   - Ou adicione o IP específico do Render (veja nos logs)

5. **Depois de corrigir, faça:**
   - "Manual Deploy" → "Clear build cache & deploy"
   - Isso força uma nova build com as variáveis atualizadas

### Frontend não carrega dados
- Verifique se `VITE_API_URL` está configurada corretamente no Vercel
- Verifique se o backend está rodando (acesse a URL do Render no navegador)
- Verifique o console do navegador para erros

