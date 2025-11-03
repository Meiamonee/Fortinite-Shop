import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import testeRoutes from "./routes/testeRoutes.js";

dotenv.config();
const app = express();

// middleware
app.use(express.json());
app.use(cors());

// conexao com banco
connectDB();

// rotas
app.use("/api/test", testeRoutes);

// rota raiz simples
app.get("/", (req, res) => {
  res.send("Servidor backend Fortnite - OK");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
