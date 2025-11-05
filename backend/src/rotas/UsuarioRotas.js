import express from "express";
import { listarUsuarios, listarCosmeticosDoUsuario } from "../controladores/UsuarioControlador.js";

const router = express.Router();

// Listar todos os usuários
router.get("/", listarUsuarios);

// Listar cosméticos comprados por um usuário
router.get("/:id/cosmeticos", listarCosmeticosDoUsuario);

export default router;
