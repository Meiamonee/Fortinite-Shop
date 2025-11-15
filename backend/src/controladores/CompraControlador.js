import Usuario from "../models/Usuario.js";
import Cosmetico from "../models/Cosmeticos.js";
import Historico from "../models/Historico.js";

// Comprar cosmético ou bundle
export const comprarCosmetico = async (req, res) => {
  try {
    const { usuarioId, cosmeticoId } = req.body;

    // Verificar se os dados foram enviados
    if (!usuarioId || !cosmeticoId) {
      return res.status(400).json({ mensagem: "Campos obrigatórios ausentes." });
    }

    // Buscar usuário e cosmético no banco
    const usuario = await Usuario.findById(usuarioId);
    const cosmetico = await Cosmetico.findById(cosmeticoId).populate('bundleItems');

    if (!usuario || !cosmetico) {
      return res.status(404).json({ mensagem: "Usuário ou cosmético não encontrado." });
    }

    // Verificar se o usuário já tem este item
    const jaComprado = usuario.cosmeticosComprados.some(
      (id) => id.toString() === cosmetico._id.toString()
    );
    if (jaComprado) {
      return res.status(400).json({ mensagem: "Este cosmético já foi comprado." });
    }

    // Verificar se tem créditos suficientes
    if (usuario.creditos < cosmetico.preco) {
      return res.status(400).json({ mensagem: "Créditos insuficientes." });
    }

    // Tirar os créditos do usuário
    usuario.creditos -= cosmetico.preco;

    // Se for bundle, adicionar o bundle e todos os itens
    if (cosmetico.isBundle && cosmetico.bundleItems && cosmetico.bundleItems.length > 0) {
      // Adiciona o bundle
      usuario.cosmeticosComprados.push(cosmetico._id);
      
      // Adiciona cada item do bundle
      for (const item of cosmetico.bundleItems) {
        const itemId = item._id || item;
        // Verificar se já não possui
        const jaTemItem = usuario.cosmeticosComprados.some(
          (id) => id.toString() === itemId.toString()
        );
        if (!jaTemItem) {
          usuario.cosmeticosComprados.push(itemId);
        }
      }

      console.log("Bundle comprado! Itens adicionados:", cosmetico.bundleItems.length);
    } else {
      // Item normal (não é bundle)
      usuario.cosmeticosComprados.push(cosmetico._id);
    }

    // Salvar no banco de dados
    const usuarioAtualizado = await usuario.save({ validateBeforeSave: true });

    // Registrar no histórico
    await Historico.create({
      usuario: usuario._id,
      cosmetico: cosmetico._id,
      tipo: "compra",
      valor: cosmetico.preco,
      data: new Date(),
    });

    res.status(200).json({
      mensagem: cosmetico.isBundle 
        ? `Bundle comprado com sucesso! ${cosmetico.bundleItems.length} itens adicionados.`
        : "Compra realizada com sucesso!",
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

// 🔹 Reembolsar um cosmético ou bundle
export const reembolsarCosmetico = async (req, res) => {
  try {
    const { usuarioId, cosmeticoId } = req.body;

    if (!usuarioId || !cosmeticoId) {
      return res.status(400).json({ mensagem: "Campos obrigatórios ausentes." });
    }

    const usuario = await Usuario.findById(usuarioId);
    const cosmetico = await Cosmetico.findById(cosmeticoId).populate('bundleItems');

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

    // Remove o item principal
    usuario.cosmeticosComprados = usuario.cosmeticosComprados.filter(
      (id) => id.toString() !== cosmetico._id.toString()
    );

    // 🎁 Se for BUNDLE, remover também todos os itens individuais
    let itensRemovidos = 1;
    if (cosmetico.isBundle && cosmetico.bundleItems && cosmetico.bundleItems.length > 0) {
      console.log(`🔄 Reembolsando bundle: "${cosmetico.nome}" com ${cosmetico.bundleItems.length} itens`);
      
      for (const item of cosmetico.bundleItems) {
        const itemId = item._id || item;
        const possuiaItem = usuario.cosmeticosComprados.some(
          (id) => id.toString() === itemId.toString()
        );
        
        if (possuiaItem) {
          usuario.cosmeticosComprados = usuario.cosmeticosComprados.filter(
            (id) => id.toString() !== itemId.toString()
          );
          itensRemovidos++;
        }
      }
      
      console.log(`✅ Bundle reembolsado: ${itensRemovidos} itens removidos (1 bundle + ${itensRemovidos - 1} itens individuais)`);
    }

    // Devolve o valor dos créditos
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

    const mensagem = cosmetico.isBundle 
      ? `Bundle reembolsado com sucesso! ${itensRemovidos} itens removidos.`
      : "Reembolso realizado com sucesso!";

    res.status(200).json({
      mensagem,
      creditosRestantes: usuarioAtualizado.creditos,
      cosmeticosComprados: usuarioAtualizado.cosmeticosComprados,
    });
  } catch (erro) {
    console.error("❌ Erro ao reembolsar cosmético:", erro);
    res.status(500).json({ mensagem: "Erro ao processar reembolso." });
  }
};