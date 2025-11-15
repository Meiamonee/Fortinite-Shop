import express from "express";
import {
  listarCosmeticos,
  importarCosmeticos,
  filtrarCosmeticos,
  sincronizarStatus,
} from "../controladores/CosmeticoControlador.js";

const router = express.Router();

// 🔹 Listar todos os cosméticos
router.get("/", listarCosmeticos);

// 🔹 Importar cosméticos da API externa
router.get("/importar", importarCosmeticos);

// 🔹 Sincronizar status (novo/loja)
router.get("/sincronizar", sincronizarStatus);

// 🔹 Filtros avançados (Etapa 8)
router.get("/filtros", filtrarCosmeticos);

export default router;
