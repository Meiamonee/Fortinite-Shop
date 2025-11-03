import express from "express";
import { listarCosmeticos, importarCosmeticos } from "../controladores/CosmeticoControlador.js";

const router = express.Router();

// Rota para listar
router.get("/", listarCosmeticos);

// Rota para importar da API
router.get("/importar", importarCosmeticos);

export default router;
