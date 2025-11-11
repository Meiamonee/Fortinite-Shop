import Usuario from "../models/Usuario.js";
import Cosmetico from "../models/Cosmeticos.js";
import Historico from "../models/Historico.js";

// 🔹 Comprar cosmético
export const comprarCosmetico = async (req, res) => {
  try {
    const { usuarioId, cosmeticoId } = req.body;

    if (!usuarioId || !cosmeticoId) {
      return res.status(400).json({ mensagem: "Campos obrigatórios ausentes." });
    }

    const usuario = await Usuario.findById(usuarioId);
    const cosmetico = await Cosmetico.findById(cosmeticoId);

    if (!usuario || !cosmetico) {
      return res.status(404).json({ mensagem: "Usuário ou cosmético não encontrado." });
    }

    const jaComprado = usuario.cosmeticosComprados.some(
      (id) => id.toString() === cosmetico._id.toString()
    );
    if (jaComprado) {
      return res.status(400).json({ mensagem: "Este cosmético já foi comprado." });
    }

    if (usuario.creditos < cosmetico.preco) {
      return res.status(400).json({ mensagem: "Créditos insuficientes." });
    }

    usuario.creditos -= cosmetico.preco;
    usuario.cosmeticosComprados.push(cosmetico._id);
    const usuarioAtualizado = await usuario.save({ validateBeforeSave: true });

    await Historico.create({
      usuario: usuario._id,
      cosmetico: cosmetico._id,
      tipo: "compra",
      valor: cosmetico.preco,
      data: new Date(),
    });

    res.status(200).json({
      mensagem: "Compra realizada com sucesso!",
      creditosRestantes: usuarioAtualizado.creditos,
      cosmeticosComprados: usuarioAtualizado.cosmeticosComprados,
    });
  } catch (erro) {
    console.error("❌ Erro ao comprar cosmético:", erro);
    res.status(500).json({ mensagem: "Erro ao processar compra." });
  }
};

// 🔹 Listar histórico de um usuário (formato legível)
export const listarHistorico = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!usuarioId) {
      return res.status(400).json({ mensagem: "ID do usuário não fornecido." });
    }

    const historico = await Historico.find({ usuario: usuarioId })
      .populate("cosmetico", "nome preco imagem _id")
      .sort({ data: -1 });

    const historicoFormatado = historico.map((item) => {
      const data = new Date(item.data);
      const dataFormatada = data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const horaFormatada = data.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        id: item._id,
        tipo: item.tipo === "compra" ? "Compra" : "Reembolso",
        valor: item.valor,
        data: `${dataFormatada} - ${horaFormatada}`,
        cosmetico: {
          _id: item.cosmetico?._id,
          nome: item.cosmetico?.nome || "Desconhecido",
          preco: item.cosmetico?.preco || 0,
          imagem: item.cosmetico?.imagem || null,
        },
      };
    });

    res.status(200).json(historicoFormatado);
  } catch (erro) {
    console.error("❌ Erro ao listar histórico:", erro.message);
    res.status(500).json({ mensagem: "Erro ao listar histórico." });
  }
};

// 🔹 Reembolsar um cosmético
export const reembolsarCosmetico = async (req, res) => {
  try {
    const { usuarioId, cosmeticoId } = req.body;

    if (!usuarioId || !cosmeticoId) {
      return res.status(400).json({ mensagem: "Campos obrigatórios ausentes." });
    }

    const usuario = await Usuario.findById(usuarioId);
    const cosmetico = await Cosmetico.findById(cosmeticoId);

    if (!usuario || !cosmetico) {
      return res.status(404).json({ mensagem: "Usuário ou cosmético não encontrado." });
    }

    // Verifica se o usuário possui o item
    const possui = usuario.cosmeticosComprados.some(
      (id) => id.toString() === cosmetico._id.toString()
    );
    if (!possui) {
      return res.status(400).json({ mensagem: "Usuário não possui este cosmético." });
    }

    // Remove o item e devolve o valor dos créditos
    usuario.cosmeticosComprados = usuario.cosmeticosComprados.filter(
      (id) => id.toString() !== cosmetico._id.toString()
    );
    usuario.creditos += cosmetico.preco;
    const usuarioAtualizado = await usuario.save({ validateBeforeSave: true });

    // Cria registro de reembolso no histórico
    await Historico.create({
      usuario: usuario._id,
      cosmetico: cosmetico._id,
      tipo: "reembolso",
      valor: cosmetico.preco,
      data: new Date(),
    });

    res.status(200).json({
      mensagem: "Reembolso realizado com sucesso!",
      creditosRestantes: usuarioAtualizado.creditos,
      cosmeticosComprados: usuarioAtualizado.cosmeticosComprados,
    });
  } catch (erro) {
    console.error("❌ Erro ao reembolsar cosmético:", erro);
    res.status(500).json({ mensagem: "Erro ao processar reembolso." });
  }
};