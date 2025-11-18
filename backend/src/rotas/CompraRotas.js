import express from "express";
import { comprarCosmetico, listarHistorico, reembolsarCosmetico } from "../controladores/CompraControlador.js";

const router = express.Router();

router.post("/comprar", comprarCosmetico);
router.get("/historico/:usuarioId", listarHistorico);
router.post("/reembolso", reembolsarCosmetico);

export default router;
