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
   🔹 SINCRONIZAR STATUS (NOVO E LOJA)
   =========================================== */
export const sincronizarStatus = async (req, res) => {
  try {
    console.log("🔄 Iniciando sincronização de status...");

    // 1️⃣ Resetar todos os status para "normal" antes de sincronizar
    await Cosmetico.updateMany({}, { status: "normal" });
    console.log("📝 Todos os status resetados para 'normal'");

    let novosCount = 0;
    let lojaCount = 0;

    // 2️⃣ Buscar cosméticos NOVOS
    try {
      const respostaNovos = await axios.get("https://fortnite-api.com/v2/cosmetics/new", {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      let itensNovos = respostaNovos.data?.data?.items || respostaNovos.data?.data || [];
      
      if (!Array.isArray(itensNovos) && typeof itensNovos === 'object') {
        itensNovos = itensNovos.br || itensNovos.items || [];
      }

      if (Array.isArray(itensNovos)) {
        for (const item of itensNovos) {
          const nome = item.name || item.displayName;
          if (nome) {
            const resultado = await Cosmetico.updateOne(
              { nome },
              { status: "novo" }
            );
            if (resultado.modifiedCount > 0) novosCount++;
          }
        }
      }
      console.log(`✅ ${novosCount} cosméticos marcados como "novo"`);
    } catch (erro) {
      console.error("⚠️ Erro ao buscar cosméticos novos:", erro.message);
    }

    // 3️⃣ Buscar cosméticos da LOJA (Shop) e BUNDLES
    try {
      const respostaLoja = await axios.get("https://fortnite-api.com/v2/shop", {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      const entries = respostaLoja.data?.data?.entries || [];
      let bundlesCount = 0;

      console.log(`🔍 Analisando ${entries.length} entradas da loja...`);
      
      // DEBUG: Verificar quantas entradas têm bundle
      const entriesComBundle = entries.filter(e => e.bundle);
      console.log(`📦 Entradas com campo 'bundle': ${entriesComBundle.length}`);

      for (const entry of entries) {
        const items = entry.items || [];
        
        // 🎁 Se tem bundle, processar como bundle (relaxado: mesmo com 1 item)
        if (entry.bundle && items.length > 0) {
          console.log(`🎁 Bundle detectado: "${entry.bundle.name}" com ${items.length} itens`);
          const nomeBundle = entry.bundle.name || entry.bundle.displayName;
          const imagemBundle = entry.bundle.image || (items[0]?.images?.icon);
          
          if (nomeBundle) {
            // Buscar IDs dos itens do bundle no banco
            const itemIds = [];
            for (const item of items) {
              const nomeItem = item.name || item.displayName || item.devName;
              if (nomeItem) {
                const itemEncontrado = await Cosmetico.findOne({
                  nome: { $regex: new RegExp(`^${nomeItem}$`, 'i') }
                });
                if (itemEncontrado) {
                  itemIds.push(itemEncontrado._id);
                  // Marca item individual como "loja"
                  await Cosmetico.updateOne(
                    { _id: itemEncontrado._id },
                    { status: "loja" }
                  );
                }
              }
            }

            // Criar ou atualizar bundle
            const bundleExistente = await Cosmetico.findOne({
              nome: { $regex: new RegExp(`^${nomeBundle}$`, 'i') }
            });

            if (bundleExistente) {
              // Atualizar bundle existente
              await Cosmetico.updateOne(
                { _id: bundleExistente._id },
                {
                  status: "loja",
                  isBundle: true,
                  bundleItems: itemIds,
                  imagem: imagemBundle || bundleExistente.imagem
                }
              );
            } else {
              // Criar novo bundle
              const precoTotal = items.reduce((sum, item) => sum + (item.price?.finalPrice || 0), 0);
              await Cosmetico.create({
                nome: nomeBundle,
                tipo: "bundle",
                raridade: items[0]?.rarity?.value || "rare",
                preco: precoTotal || Math.floor(Math.random() * 3000) + 1000,
                imagem: imagemBundle,
                status: "loja",
                isBundle: true,
                bundleItems: itemIds
              });
            }
            
            bundlesCount++;
            lojaCount++;
          }
        } else {
          // Item individual (não bundle)
          for (const item of items) {
            const nome = item.name || item.displayName || item.devName;
            
            if (nome) {
              const resultado = await Cosmetico.updateOne(
                { nome: { $regex: new RegExp(`^${nome}$`, 'i') } },
                { status: "loja" }
              );
              if (resultado.modifiedCount > 0) {
                lojaCount++;
              }
            }
          }
        }
      }
      console.log(`✅ ${lojaCount} cosméticos marcados como "loja" (${bundlesCount} bundles)`);
    } catch (erro) {
      console.error("⚠️ Erro ao buscar shop:", erro.message);
    }

    const mensagem = `Sincronização de status concluída! ${novosCount} novos, ${lojaCount} na loja.`;

    res.status(200).json({
      mensagem,
      novos: novosCount,
      loja: lojaCount,
    });
  } catch (erro) {
    console.error("❌ Erro ao sincronizar status:", erro.message);
    res.status(500).json({ mensagem: "Erro ao sincronizar status." });
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
