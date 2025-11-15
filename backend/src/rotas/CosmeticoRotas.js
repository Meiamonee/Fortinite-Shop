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

// 🔹 Listar todos os cosméticos
router.get("/", listarCosmeticos);

// 🔹 Listar apenas cosméticos à venda (shop)
router.get("/shop", listarShop);

// 🔹 Listar apenas cosméticos novos
router.get("/novos", listarNovos);

// 🔹 Importar cosméticos da API externa
router.get("/importar", importarCosmeticos);

// 🔹 Sincronizar status (novo/loja)
router.get("/sincronizar", sincronizarStatus);

// 🔹 Criar itens de teste em promoção
router.get("/teste-promocao", criarItensPromocaoTeste);

// 🔹 Filtros avançados (Etapa 8)
router.get("/filtros", filtrarCosmeticos);

export default router;
