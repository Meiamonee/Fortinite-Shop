import axios from "axios";
import Cosmetico from "../models/Cosmeticos.js";
import mongoose from "mongoose";

export const buscarCosmeticoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ mensagem: "ID inválido." });
    }
    
    const cosmetico = await Cosmetico.findById(id).populate('bundleItems');
    
    if (!cosmetico) {
      return res.status(404).json({ mensagem: "Cosmético não encontrado." });
    }
    
    res.status(200).json(cosmetico);
  } catch (erro) {
    console.error("Erro ao buscar cosmético:", erro.message);
    res.status(500).json({ mensagem: "Erro ao buscar cosmético." });
  }
};

export const listarCosmeticos = async (req, res) => {
  try {
    const { page = 1, limit = 24, nome, tipo, raridade, status, promocao } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const filtro = {};
    
    if (nome) filtro.nome = { $regex: nome, $options: "i" };
    if (tipo) filtro.tipo = tipo;
    if (raridade) filtro.raridade = raridade;
    if (status) filtro.status = status;
    
    if (promocao === "true") {
      filtro.regularPrice = { $exists: true, $ne: null };
      filtro.preco = { $exists: true, $ne: null };
      filtro.$expr = { $gt: ["$regularPrice", "$preco"] };
    }
    
    const total = await Cosmetico.countDocuments(filtro);
    const cosmeticos = await Cosmetico.find(filtro)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('nome tipo raridade preco regularPrice imagem status isBundle bundleItems createdAt');
    
    res.status(200).json({
      cosmeticos,
      total,
      paginaAtual: parseInt(page),
      totalPaginas: Math.ceil(total / parseInt(limit)),
      itensPorPagina: parseInt(limit)
    });
  } catch (erro) {
    console.error("Erro ao listar cosméticos:", erro.message);
    res.status(500).json({ mensagem: "Erro ao listar cosméticos." });
  }
};

// Importa cosméticos da API Fortnite
export const importarCosmeticos = async (req, res) => {
  try {
    console.log("Iniciando importação de cosméticos da API Fortnite...");
    
    const resposta = await axios.get("https://fortnite-api.com/v2/cosmetics/br", {
      headers: { "User-Agent": "Mozilla/5.0" },
      timeout: 30000,
    });

    const itens = resposta.data?.data || [];
    console.log(`Total de itens recebidos da API: ${itens.length}`);
    
    if (itens.length === 0) {
      console.warn("Nenhum item recebido da API!");
      return res.status(400).json({ 
        mensagem: "Nenhum cosmético recebido da API Fortnite.",
        total: 0
      });
    }

    let novos = 0;
    let existentes = 0;
    let erros = 0;

    for (const item of itens) {
      try {
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
        } else {
          existentes++;
        }
      } catch (itemErro) {
        erros++;
        console.error(`Erro ao processar item:`, itemErro.message);
      }
    }

    console.log(`Importação concluída: ${novos} novos, ${existentes} já existentes, ${erros} erros`);

    const mensagem = `Importação concluída. ${novos} novos cosméticos adicionados.`;
    
    if (res && res.status) {
      res.status(201).json({
        mensagem,
        novos,
        existentes,
        erros,
        total: itens.length
      });
    } else {
      console.log(mensagem);
    }
  } catch (erro) {
    const mensagemErro = `Erro ao importar cosméticos: ${erro.message}`;
    console.error(mensagemErro);
    console.error("Stack:", erro.stack);
    
    if (res && res.status) {
      res.status(500).json({ 
        mensagem: "Erro ao importar cosméticos.",
        erro: erro.message 
      });
    }
  }
};

// Sincroniza status (novo/loja) dos cosméticos
export const sincronizarStatus = async (req, res) => {
  try {
    // Reseta todos os status para normal antes de sincronizar
    await Cosmetico.updateMany({}, { status: "normal" });

    let novosCount = 0;
    let lojaCount = 0;

    // Busca cosméticos novos
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
    } catch (erro) {
      console.error("Erro ao buscar cosméticos novos:", erro.message);
    }

    // Busca cosméticos da loja e bundles
    try {
      const respostaLoja = await axios.get("https://fortnite-api.com/v2/shop", {
        headers: { "User-Agent": "Mozilla/5.0" },
      });

      const entries = respostaLoja.data?.data?.entries || [];
      let bundlesCount = 0;

      for (const entry of entries) {
        const items = entry.brItems || entry.items || [];
        
        // Processa bundles
        if (entry.bundle && items.length > 0) {
          const nomeBundle = entry.bundle.name || entry.bundle.displayName;
          const imagemBundle = entry.bundle.image || (items[0]?.images?.icon);
          
          if (nomeBundle) {
            // Busca IDs dos itens do bundle no banco
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

            // Cria ou atualiza bundle
            const bundleExistente = await Cosmetico.findOne({
              nome: { $regex: new RegExp(`^${nomeBundle}$`, 'i') }
            });

            if (bundleExistente) {
              await Cosmetico.updateOne(
                { _id: bundleExistente._id },
                {
                  status: "loja",
                  isBundle: true,
                  bundleItems: itemIds,
                  imagem: imagemBundle || bundleExistente.imagem,
                  preco: entry.finalPrice || bundleExistente.preco,
                  regularPrice: entry.regularPrice || entry.finalPrice
                }
              );
            } else {
              const precoFinal = entry.finalPrice || Math.floor(Math.random() * 3000) + 1000;
              const precoRegular = entry.regularPrice || precoFinal;
              await Cosmetico.create({
                nome: nomeBundle,
                tipo: "bundle",
                raridade: items[0]?.rarity?.value || "rare",
                preco: precoFinal,
                regularPrice: precoRegular,
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
              // Atualiza com preços da API
              const updateData = {
                status: "loja"
              };
              
              // Só atualiza preço se a API fornecer
              if (entry.finalPrice) {
                updateData.preco = entry.finalPrice;
              }
              
              // Só adiciona regularPrice se for diferente do preço final (promoção)
              if (entry.regularPrice && entry.finalPrice && entry.regularPrice > entry.finalPrice) {
                updateData.regularPrice = entry.regularPrice;
                console.log(`Promoção detectada: ${nome} - Regular: ${entry.regularPrice}, Final: ${entry.finalPrice}`);
              } else if (entry.regularPrice) {
                updateData.regularPrice = entry.regularPrice;
              }
              
              const resultado = await Cosmetico.updateOne(
                { nome: { $regex: new RegExp(`^${nome}$`, 'i') } },
                updateData
              );
              if (resultado.modifiedCount > 0) {
                lojaCount++;
              }
            }
          }
        }
      }
    } catch (erro) {
      console.error("Erro ao buscar shop:", erro.message);
    }

    const mensagem = `Sincronização de status concluída! ${novosCount} novos, ${lojaCount} na loja.`;

    res.status(200).json({
      mensagem,
      novos: novosCount,
      loja: lojaCount,
    });
  } catch (erro) {
    console.error("Erro ao sincronizar status:", erro.message);
    res.status(500).json({ mensagem: "Erro ao sincronizar status." });
  }
};

export const filtrarCosmeticos = async (req, res) => {
  try {
    const { nome, tipo, raridade, dataInicio, dataFim, novos, loja, promocao } = req.query;
    const filtro = {};

    if (nome) filtro.nome = { $regex: nome, $options: "i" };
    if (tipo) filtro.tipo = tipo;
    if (raridade) filtro.raridade = raridade;

    if (dataInicio || dataFim) {
      filtro.createdAt = {};
      if (dataInicio) filtro.createdAt.$gte = new Date(dataInicio);
      if (dataFim) filtro.createdAt.$lte = new Date(dataFim);
    }

    if (novos === "true") filtro.status = "novo";
    if (loja === "true") filtro.status = "loja";
    if (promocao === "true") {
      // Promoção: regularPrice > preco
      filtro.regularPrice = { $exists: true, $ne: null };
      filtro.preco = { $exists: true, $ne: null };
      filtro.$expr = { $gt: ["$regularPrice", "$preco"] };
    }

    const cosmeticos = await Cosmetico.find(filtro).sort({ createdAt: -1 });

    res.status(200).json({
      total: cosmeticos.length,
      filtrosUsados: filtro,
      cosmeticos,
    });
  } catch (erro) {
    console.error("Erro ao filtrar cosméticos:", erro.message);
    res.status(500).json({ mensagem: "Erro ao aplicar filtros." });
  }
};

export const listarShop = async (req, res) => {
  try {
    const cosmeticosNaLoja = await Cosmetico.find({ status: "loja" }).sort({ createdAt: -1 });
    res.status(200).json({
      total: cosmeticosNaLoja.length,
      cosmeticos: cosmeticosNaLoja,
    });
  } catch (erro) {
    console.error("Erro ao listar shop:", erro.message);
    res.status(500).json({ mensagem: "Erro ao listar shop." });
  }
};

export const listarNovos = async (req, res) => {
  try {
    const cosmeticosNovos = await Cosmetico.find({ status: "novo" }).sort({ createdAt: -1 });
    res.status(200).json({
      total: cosmeticosNovos.length,
      cosmeticos: cosmeticosNovos,
    });
  } catch (erro) {
    console.error("Erro ao listar novos:", erro.message);
    res.status(500).json({ mensagem: "Erro ao listar novos." });
  }
};

export const criarItensPromocaoTeste = async (req, res) => {
  try {
    const itensTeste = [
      {
        nome: "TESTE - Skin Épica em Promoção",
        tipo: "outfit",
        raridade: "epic",
        preco: 1200,
        regularPrice: 1600,
        imagem: "https://via.placeholder.com/150",
        status: "loja"
      },
      {
        nome: "TESTE - Picareta Rara 50% OFF",
        tipo: "pickaxe",
        raridade: "rare",
        preco: 500,
        regularPrice: 1000,
        imagem: "https://via.placeholder.com/150",
        status: "loja"
      },
      {
        nome: "TESTE - Bundle Lendário Desconto",
        tipo: "bundle",
        raridade: "legendary",
        preco: 2000,
        regularPrice: 2800,
        imagem: "https://via.placeholder.com/150",
        status: "loja",
        isBundle: true
      }
    ];

    let criados = 0;
    for (const item of itensTeste) {
      const existe = await Cosmetico.findOne({ nome: item.nome });
      if (!existe) {
        await Cosmetico.create(item);
        criados++;
      }
    }

    res.status(200).json({ 
      mensagem: `${criados} itens de teste em promoção criados com sucesso!`,
      itensCriados: criados
    });
  } catch (erro) {
    console.error("Erro ao criar itens de teste:", erro.message);
    res.status(500).json({ mensagem: "Erro ao criar itens de teste." });
  }
};
