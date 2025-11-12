import express from "express";
import { 
  listarUsuarios, 
  listarCosmeticosDoUsuario,
  listarUsuariosPublicos 
} from "../controladores/UsuarioControlador.js";

const router = express.Router();

// Listar todos os usuários
router.get("/", listarUsuarios);

// 🔹 Nova rota pública para listar usuários
router.get("/publicos", listarUsuariosPublicos);

// Listar cosméticos comprados por um usuário
router.get("/:id/cosmeticos", listarCosmeticosDoUsuario);

export default router;