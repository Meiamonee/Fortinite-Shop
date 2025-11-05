import express from "express";
import { comprarCosmetico, listarHistorico, reembolsarCosmetico } from "../controladores/CompraControlador.js";

const router = express.Router();

// Comprar um cosmético
router.post("/comprar", comprarCosmetico);

// Listar histórico de um usuário
router.get("/historico/:usuarioId", listarHistorico);

router.post("/reembolso", reembolsarCosmetico);

export default router;
