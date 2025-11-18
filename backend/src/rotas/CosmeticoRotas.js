import express from "express";
import {
  listarCosmeticos,
  importarCosmeticos,
  filtrarCosmeticos,
  sincronizarStatus,
  listarShop,
  listarNovos,
  criarItensPromocaoTeste,
} from "../controladores/CosmeticoControlador.js";

const router = express.Router();

router.get("/", listarCosmeticos);
router.get("/shop", listarShop);
router.get("/novos", listarNovos);
router.get("/importar", importarCosmeticos);
router.get("/sincronizar", sincronizarStatus);
router.get("/teste-promocao", criarItensPromocaoTeste);
router.get("/filtros", filtrarCosmeticos);

export default router;
