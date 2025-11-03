import axios from "axios";
import Cosmetico from "../models/Cosmeticos.js";

// 🔹 Listar cosméticos salvos
export const listarCosmeticos = async (req, res) => {
  try {
    const cosmeticos = await Cosmetico.find();
    res.status(200).json(cosmeticos);
  } catch (erro) {
    console.error("Erro ao listar cosméticos:", erro.message);
    res.status(500).json({ mensagem: "Erro ao listar cosméticos." });
  }
};

// 🔹 Importar cosméticos da API Fortnite
export const importarCosmeticos = async (req, res) => {
  try {
    console.log("🔹 Iniciando importação da API Fortnite...");

    const resposta = await axios.get("https://fortnite-api.com/v2/cosmetics/br", {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    console.log("✅ API Fortnite respondida com sucesso!");

    const itens = resposta.data.data;
    console.log(`🔹 Total de itens recebidos: ${itens?.length}`);

    let novos = 0;

    for (const item of itens) {
      const nome = item.name || item.displayName || "Sem nome";
      const tipo = item.type?.value || item.type || "desconhecido";
      const raridade = item.rarity?.value || "comum";
      const imagem = item.images?.icon || null;

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

    console.log(`✅ Importação concluída: ${novos} novos itens.`);

    res.status(201).json({
      mensagem: `Importação concluída. ${novos} novos cosméticos adicionados.`,
    });
  } catch (erro) {
    console.error("❌ Erro ao importar cosméticos:", erro.message);
    res.status(500).json({ mensagem: "Erro ao importar cosméticos." });
  }
};
