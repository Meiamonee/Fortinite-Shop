import Usuario from "../models/Usuario.js";
import Cosmetico from "../models/Cosmeticos.js";
import Historico from "../models/Historico.js";

// 🔹 Comprar cosmético
export const comprarCosmetico = async (req, res) => {
  try {
    const { usuarioId, cosmeticoId } = req.body;

    const usuario = await Usuario.findById(usuarioId);
    const cosmetico = await Cosmetico.findById(cosmeticoId);

    if (!usuario || !cosmetico) {
      return res.status(404).json({ mensagem: "Usuário ou cosmético não encontrado." });
    }

    // Verifica se o usuário já comprou este item
    const jaComprado = usuario.cosmeticosComprados.includes(cosmeticoId);
    if (jaComprado) {
      return res.status(400).json({ mensagem: "Este cosmético já foi comprado." });
    }

    // Verifica créditos suficientes
    if (usuario.creditos < cosmetico.preco) {
      return res.status(400).json({ mensagem: "Créditos insuficientes." });
    }

    // Atualiza créditos e adiciona o item comprado
    const usuarioAtualizado = await Usuario.findByIdAndUpdate(
      usuarioId,
      {
        $inc: { creditos: -cosmetico.preco },
        $push: { cosmeticosComprados: cosmetico._id }
      },
      { new: true } // retorna o documento atualizado
    );

    // Cria histórico da compra
    await Historico.create({
      usuario: usuario._id,
      cosmetico: cosmetico._id,
      tipo: "compra",
      valor: cosmetico.preco
    });

    res.status(200).json({
      mensagem: "Compra realizada com sucesso!",
      creditosRestantes: usuarioAtualizado.creditos
    });
  } catch (erro) {
    console.error("Erro ao comprar cosmético:", erro.message);
    res.status(500).json({ mensagem: "Erro ao processar compra." });
  }
};

// 🔹 Listar histórico de um usuário (com formato legível)
export const listarHistorico = async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const historico = await Historico.find({ usuario: usuarioId })
      .populate("cosmetico", "nome preco imagem")
      .sort({ data: -1 });

    // 🔹 Formata cada registro antes de enviar
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
          nome: item.cosmetico?.nome || "Desconhecido",
          preco: item.cosmetico?.preco || 0,
          imagem: item.cosmetico?.imagem || null,
        },
      };
    });

    res.status(200).json(historicoFormatado);
  } catch (erro) {
    console.error("Erro ao listar histórico:", erro.message);
    res.status(500).json({ mensagem: "Erro ao listar histórico." });
  }
};

