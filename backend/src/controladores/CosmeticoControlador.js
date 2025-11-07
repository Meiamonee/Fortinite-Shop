import axios from "axios";
import Cosmetico from "../models/Cosmeticos.js";

/* ===========================================
   🔹 LISTAR COSMÉTICOS (Todos ou com filtros)
   =========================================== */
export const listarCosmeticos = async (req, res) => {
  try {
    const cosmeticos = await Cosmetico.find().sort({ createdAt: -1 });
    res.status(200).json(cosmeticos);
  } catch (erro) {
    console.error("❌ Erro ao listar cosméticos:", erro.message);
    res.status(500).json({ mensagem: "Erro ao listar cosméticos." });
  }
};

/* ===========================================
   🔹 IMPORTAR COSMÉTICOS DA API FORTNITE
   =========================================== */
export const importarCosmeticos = async (req, res) => {
  try {
    console.log("🌐 Iniciando importação da API Fortnite...");

    const resposta = await axios.get("https://fortnite-api.com/v2/cosmetics/br", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const itens = resposta.data?.data || [];
    console.log(`📦 Total de itens recebidos: ${itens.length}`);

    let novos = 0;

    for (const item of itens) {
      const nome = item.name || item.displayName || "Sem nome";
      const tipo = item.type?.value || item.type || "desconhecido";
      const raridade = item.rarity?.value || "comum";
      const imagem = item.images?.icon || null;

      // Evita duplicação
      const existente = await Cosmetico.findOne({ nome });
      if (!existente) {
        await Cosmetico.create({
          nome,
          tipo,
          raridade,
          preco: Math.floor(Math.random() * 5000) + 500,
          imagem,
          status: "normal",
        });
        novos++;
      }
    }

    console.log(`✅ Importação concluída: ${novos} novos itens adicionados.`);
    res.status(201).json({
      mensagem: `Importação concluída. ${novos} novos cosméticos adicionados.`,
    });
  } catch (erro) {
    console.error("❌ Erro ao importar cosméticos:", erro.message);
    res.status(500).json({ mensagem: "Erro ao importar cosméticos." });
  }
};

/* ===========================================
   🔹 FILTRAR COSMÉTICOS (ETAPA 8)
   =========================================== */
export const filtrarCosmeticos = async (req, res) => {
  try {
    const { nome, tipo, raridade, dataInicio, dataFim, novos, loja, promocao } = req.query;
    const filtro = {};

    // Nome (texto livre)
    if (nome) filtro.nome = { $regex: nome, $options: "i" };

    // Tipo (outfit, backpack, etc.)
    if (tipo) filtro.tipo = tipo;

    // Raridade (rare, epic, etc.)
    if (raridade) filtro.raridade = raridade;

    // Intervalo de datas
    if (dataInicio || dataFim) {
      filtro.createdAt = {};
      if (dataInicio) filtro.createdAt.$gte = new Date(dataInicio);
      if (dataFim) filtro.createdAt.$lte = new Date(dataFim);
    }

    // Apenas novos
    if (novos === "true") filtro.status = "novo";

    // Apenas cosméticos à venda
    if (loja === "true") filtro.status = "loja";

    // Apenas em promoção (campo desconto > 0)
    if (promocao === "true") filtro.desconto = { $exists: true, $gt: 0 };

    const cosmeticos = await Cosmetico.find(filtro).sort({ createdAt: -1 });

    res.status(200).json({
      total: cosmeticos.length,
      filtrosUsados: filtro,
      cosmeticos,
    });
  } catch (erro) {
    console.error("❌ Erro ao filtrar cosméticos:", erro.message);
    res.status(500).json({ mensagem: "Erro ao aplicar filtros." });
  }
};
