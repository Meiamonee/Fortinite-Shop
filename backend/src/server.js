import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import AuthRotas from "./rotas/AuthRotas.js";
import CosmeticoRotas from "./rotas/CosmeticoRotas.js";
import CompraRotas from "./rotas/CompraRotas.js";
import UsuarioRotas from "./rotas/UsuarioRotas.js";

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
