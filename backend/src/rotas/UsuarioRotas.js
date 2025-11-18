import express from "express";
import { 
  listarUsuarios, 
  listarCosmeticosDoUsuario,
  listarUsuariosPublicos 
} from "../controladores/UsuarioControlador.js";

const router = express.Router();

router.get("/", listarUsuarios);
router.get("/publicos", listarUsuariosPublicos);
router.get("/:id/cosmeticos", listarCosmeticosDoUsuario);

export default router;
