import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import AuthRotas from "./rotas/authRotas.js";
import CosmeticoRotas from "./rotas/CosmeticoRotas.js";
import CompraRotas from "./rotas/CompraRotas.js";
import UsuarioRotas from "./rotas/UsuarioRotas.js";
import { importarCosmeticos, sincronizarStatus } from "./controladores/CosmeticoControlador.js";
import cron from "node-cron";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.use("/auth", AuthRotas);
app.use("/cosmeticos", CosmeticoRotas);
app.use("/compras", CompraRotas);
app.use("/usuarios", UsuarioRotas);

app.get("/", (req, res) => res.send("Servidor backend Fortnite - OK"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

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

// Executa sincronização na inicialização
executarSincronizacaoCompleta();

// Executa sincronização a cada 6 horas
cron.schedule("0 */6 * * *", () => {
  executarSincronizacaoCompleta();
});
