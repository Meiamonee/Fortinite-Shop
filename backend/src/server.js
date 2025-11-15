import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import AuthRotas from "./rotas/AuthRotas.js";
import CosmeticoRotas from "./rotas/CosmeticoRotas.js";
import CompraRotas from "./rotas/CompraRotas.js";
import UsuarioRotas from "./rotas/UsuarioRotas.js";
import { importarCosmeticos, sincronizarStatus } from "./controladores/CosmeticoControlador.js";
import cron from "node-cron";

dotenv.config();
const app = express();

// 🔹 Middlewares
app.use(express.json());
app.use(cors());

// 🔹 Conexão com o MongoDB
connectDB();

// 🔹 Rotas
app.use("/auth", AuthRotas);
app.use("/cosmeticos", CosmeticoRotas);
app.use("/compras", CompraRotas);
app.use("/usuarios", UsuarioRotas);

// 🔹 Rota de teste
app.get("/", (req, res) => res.send("Servidor backend Fortnite - OK"));

// 🔹 Porta do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em http://localhost:${PORT}`));

/* =======================================================
   🔄 SINCRONIZAÇÃO AUTOMÁTICA COM A API FORTNITE
   ======================================================= */

// Função auxiliar para executar a importação sem resposta HTTP
const executarImportacao = async () => {
  try {
    console.log("🔁 [SYNC] Iniciando sincronização com API Fortnite...");
    const req = {}; // mocks vazios
    const res = {
      status: () => ({
        json: (data) => console.log("✅ [SYNC] Resultado:", data.mensagem || "Sincronização concluída."),
      }),
    };
    await importarCosmeticos(req, res);
    console.log("✅ [SYNC] Importação de cosméticos finalizada.\n");
  } catch (erro) {
    console.error("❌ [SYNC] Erro ao sincronizar cosméticos:", erro.message);
  }
};

// Função auxiliar para sincronizar status (novo/loja)
const executarSincronizacaoStatus = async () => {
  try {
    console.log("🔄 [STATUS] Iniciando sincronização de status...");
    const req = {}; // mocks vazios
    const res = {
      status: () => ({
        json: (data) => console.log("✅ [STATUS] Resultado:", data.mensagem || "Status sincronizados."),
      }),
    };
    await sincronizarStatus(req, res);
    console.log("✅ [STATUS] Sincronização de status finalizada.\n");
  } catch (erro) {
    console.error("❌ [STATUS] Erro ao sincronizar status:", erro.message);
  }
};

// Função principal que executa tudo
const executarSincronizacaoCompleta = async () => {
  await executarImportacao();
  await executarSincronizacaoStatus();
};

// 🔹 Executa a primeira sincronização assim que o servidor inicia
executarSincronizacaoCompleta();

// 🔹 Executa automaticamente a cada 6 horas
cron.schedule("0 */6 * * *", () => {
  console.log("🕒 [CRON] Executando sincronização automática completa...");
  executarSincronizacaoCompleta();
});
