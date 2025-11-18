import express from "express";
import {
  listarCosmeticos,
  buscarCosmeticoPorId,
  importarCosmeticos,
  filtrarCosmeticos,
  sincronizarStatus,
  listarShop,
  listarNovos,
  criarItensPromocaoTeste,
} from "../controladores/CosmeticoControlador.js";

const router = express.Router();

// Rotas específicas primeiro (antes de /:id)
router.get("/shop", listarShop);
router.get("/novos", listarNovos);
router.get("/importar", importarCosmeticos);
router.get("/sincronizar", sincronizarStatus);
router.get("/teste-promocao", criarItensPromocaoTeste);
router.get("/filtros", filtrarCosmeticos);

// Rotas dinâmicas por último
router.get("/", listarCosmeticos);
router.get("/:id", buscarCosmeticoPorId);

export default router;
