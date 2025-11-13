import Usuario from "../models/Usuario.js";
import Cosmetico from "../models/Cosmeticos.js";

// 🔹 Listar todos os usuários
export const listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, "name email creditos cosmeticosComprados");
    res.status(200).json(usuarios);
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro.message);
    res.status(500).json({ mensagem: "Erro ao listar usuários." });
  }
};

// 🔹 Listar cosméticos comprados por um usuário
export const listarCosmeticosDoUsuario = async (req, res) => {
  try {
    const usuarioId = req.params.id.trim();

    const usuario = await Usuario.findById(usuarioId).populate("cosmeticosComprados");

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado." });
    }

    // 🔹 IMPORTANTE: Mapear os campos corretamente
    const cosmeticos = usuario.cosmeticosComprados.map((item) => ({
      _id: item._id, // 🔹 Garantir que _id está presente
      id: item._id,  // 🔹 Adicionar id também para compatibilidade
      nome: item.nome,
      tipo: item.tipo,
      raridade: item.raridade,
      preco: item.preco,
      imagem: item.imagem,
      status: item.status
    }));

    res.status(200).json({
      usuario: {
        id: usuario._id,
        nome: usuario.name, // 🔹 Retornar "nome" não "name"
        email: usuario.email,
        creditos: usuario.creditos
      },
      cosmeticos
    });
  } catch (erro) {
    console.error("Erro ao listar cosméticos do usuário:", erro.message);
    res.status(500).json({ mensagem: "Erro ao listar cosméticos do usuário." });
  }
};

// 🔹 Listar usuários públicos com paginação
export const listarUsuariosPublicos = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const usuarios = await Usuario.find({}, "name email creditos cosmeticosComprados createdAt")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Usuario.countDocuments();

    res.status(200).json({
      usuarios,
      totalPaginas: Math.ceil(total / limit),
      paginaAtual: parseInt(page),
      total
    });
  } catch (erro) {
    console.error("Erro ao listar usuários públicos:", erro.message);
    res.status(500).json({ mensagem: "Erro ao listar usuários." });
  }
};
