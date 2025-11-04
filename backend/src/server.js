import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import AuthRotas from "./rotas/authRotas.js";
import CosmeticoRotas from "./rotas/CosmeticoRotas.js";
import CompraRotas from "./rotas/CompraRotas.js";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Conexão com o banco
connectDB();

// Rotas principais
app.use("/auth", AuthRotas);
app.use("/cosmeticos", CosmeticoRotas);
app.use("/compras", CompraRotas);

// Rota raiz
app.get("/", (req, res) => {
  res.send("Servidor backend Fortnite - OK");
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
