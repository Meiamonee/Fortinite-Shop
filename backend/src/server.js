import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import AuthRotas from "./rotas/authRotas.js";
import CosmeticoRotas from "./rotas/CosmeticoRotas.js";
import CompraRotas from "./rotas/CompraRotas.js";
import UsuarioRotas from "./rotas/UsuarioRotas.js";
import { importarCosmeticos, sincronizarStatus } from "./controladores/CosmeticoControlador.js";
import cron from "node-cron";

dotenv.config();

// Debug: verifica variáveis de ambiente
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGO_URI definida:", !!process.env.MONGO_URI);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL || "não definida");

const app = express();

app.use(express.json());

// Configuração CORS
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://seu-frontend.vercel.app'
    : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Conecta ao banco antes de iniciar o servidor
connectDB().then(() => {
  console.log("Banco conectado, iniciando servidor...");
}).catch((error) => {
  console.error("Falha ao conectar ao banco:", error);
  process.exit(1);
});

app.use("/auth", AuthRotas);
app.use("/cosmeticos", CosmeticoRotas);
app.use("/compras", CompraRotas);
app.use("/usuarios", UsuarioRotas);

app.get("/", (req, res) => res.send("Servidor backend Fortnite - OK"));

const PORT = process.env.PORT || 5000;

// Aguarda conexão com MongoDB antes de iniciar sincronizações
mongoose.connection.once('open', () => {
  console.log("Conexão MongoDB estabelecida, iniciando sincronizações...");
  
  // Sincronização automática com API Fortnite
  executarSincronizacaoCompleta();
  
  // Executa sincronização a cada 6 horas
  cron.schedule("0 */6 * * *", () => {
    executarSincronizacaoCompleta();
  });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// Sincronização automática com API Fortnite
const executarImportacao = async () => {
  try {
    const req = {};
    const res = {
      status: () => ({
        json: () => {},
      }),
    };
    await importarCosmeticos(req, res);
  } catch (erro) {
    console.error("Erro ao sincronizar cosméticos:", erro.message);
  }
};

const executarSincronizacaoStatus = async () => {
  try {
    const req = {};
    const res = {
      status: () => ({
        json: () => {},
      }),
    };
    await sincronizarStatus(req, res);
  } catch (erro) {
    console.error("Erro ao sincronizar status:", erro.message);
  }
};

const executarSincronizacaoCompleta = async () => {
  await executarImportacao();
  await executarSincronizacaoStatus();
};
