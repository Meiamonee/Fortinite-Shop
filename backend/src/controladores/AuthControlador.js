import Usuario from "../models/Usuario.js";

export const cadastrarUsuario = async (req, res) => {
  try {
    const { name, email, senha } = req.body;

    // Verifica se já existe usuário com esse e-mail
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensagem: "E-mail já cadastrado!" });
    }

    const novoUsuario = new Usuario({ name, email, senha });
    await novoUsuario.save();

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso!",
      usuario: {
        id: novoUsuario._id,
        name: novoUsuario.name,
        email: novoUsuario.email,
        creditos: novoUsuario.creditos,
      },
    });
  } catch (erro) {
    console.error("Erro ao cadastrar usuário:", erro);
    res.status(500).json({ mensagem: "Erro interno ao cadastrar usuário." });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Busca usuário pelo e-mail
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(404).json({ mensagem: "Usuário não encontrado!" });
    }

    // Verifica senha
    if (usuario.senha !== senha) {
      return res.status(401).json({ mensagem: "Senha incorreta!" });
    }

    res.status(200).json({
      mensagem: "Login realizado com sucesso!",
      usuario: {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        creditos: usuario.creditos,
      },
    });
  } catch (erro) {
    console.error("Erro ao fazer login:", erro);
    res.status(500).json({ mensagem: "Erro interno ao fazer login." });
  }
};
