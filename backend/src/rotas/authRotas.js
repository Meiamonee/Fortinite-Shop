import express from "express";
import { cadastrarUsuario, loginUsuario } from "../controladores/AuthControlador.js";

const router = express.Router();

router.post("/registrar", cadastrarUsuario);
router.post("/login", loginUsuario);

export default router;
