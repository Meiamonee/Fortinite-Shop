import { useState, useEffect } from "react";
import api from "../services/api";
import CosmeticoCard from "../components/CosmeticoCard";
import Paginacao from "../components/Paginacao"; // 🔹 IMPORTAR COMPONENTE
import "../style/Loja.css";

export default function Loja() {
  const [cosmeticos, setCosmeticos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 24;
  const [filtro, setFiltro] = useState({
    nome: "",
    tipo: "",
    raridade: "",
    status: "", // novo, loja, ou vazio (todos)
    dataInicio: "",
    dataFim: "",
  });

  // 🔹 Carrega cosméticos (acessível sem login)
  useEffect(() => {
    async function carregarCosmeticos() {
      try {
        const resposta = await api.get("/cosmeticos");
        setCosmeticos(resposta.data);
        
        // Debug: Verificar quantos itens em promoção vieram
        const emPromocao = resposta.data.filter(item => 
          item.regularPrice && item.preco && item.regularPrice > item.preco
        );
        console.log(`🔥 Itens em promoção carregados do backend: ${emPromocao.length}`);
        if (emPromocao.length > 0) {
          console.log("Exemplos:", emPromocao.slice(0, 3).map(i => ({
            nome: i.nome,
            regularPrice: i.regularPrice,
            preco: i.preco
          })));
        }
      } catch (erro) {
        console.error("Erro ao carregar cosméticos:", erro);
      }
    }
    carregarCosmeticos();
  }, []);

  // Filtragem local dos cosméticos
  const cosmeticosFiltrados = cosmeticos.filter((item) => {
    const nomeMatch = item.nome.toLowerCase().includes(filtro.nome.toLowerCase());
    const tipoMatch = filtro.tipo ? item.tipo === filtro.tipo : true;
    const raridadeMatch = filtro.raridade ? item.raridade === filtro.raridade : true;
    
    // Status especial: bundle é identificado por isBundle, não por status
    let statusMatch = true;
    if (filtro.status === "bundle") {
      statusMatch = item.isBundle === true;
    } else if (filtro.status === "promocao") {
      // Em promoção: regularPrice > preco
      const emPromocao = item.regularPrice && item.preco && item.regularPrice > item.preco;
      
      // Debug - mostrar no console quando filtrar por promoção
      if (filtro.status === "promocao" && emPromocao) {
        console.log("🔥 Item em promoção encontrado:", item.nome, {
          regularPrice: item.regularPrice,
          preco: item.preco
        });
      }
      
      statusMatch = emPromocao;
    } else if (filtro.status) {
      statusMatch = item.status === filtro.status;
    }

    const dataItem = new Date(item.createdAt);
    const inicioMatch = filtro.dataInicio ? dataItem >= new Date(filtro.dataInicio) : true;
    const fimMatch = filtro.dataFim ? dataItem <= new Date(filtro.dataFim) : true;

    return nomeMatch && tipoMatch && raridadeMatch && statusMatch && inicioMatch && fimMatch;
  });

  // Debug: mostrar quantos itens foram filtrados
  if (filtro.status === "promocao") {
    console.log(`📊 Total de itens em promoção após filtro: ${cosmeticosFiltrados.length}`);
  }

  // 🔹 Paginação
  const totalPaginas = Math.ceil(cosmeticosFiltrados.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const cosmeticosPaginados = cosmeticosFiltrados.slice(indiceInicial, indiceInicial + itensPorPagina);

  // 🔹 Função para mudar de página
  const handleMudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  useEffect(() => setPaginaAtual(1), [filtro]);

  return (
    <div className="loja-container">
      <div className="filtros-container">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={filtro.nome}
          onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
          className="filtro-input"
        />

        <select
          value={filtro.tipo}
          onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
          className="filtro-select"
        >
          <option value="">Tipo</option>
          <option value="outfit">Outfit</option>
          <option value="backpack">Backpack</option>
          <option value="pickaxe">Pickaxe</option>
          <option value="emote">Emote</option>
        </select>

        <select
          value={filtro.raridade}
          onChange={(e) => setFiltro({ ...filtro, raridade: e.target.value })}
          className="filtro-select"
        >
          <option value="">Raridade</option>
          <option value="common">Comum</option>
          <option value="rare">Raro</option>
          <option value="epic">Épico</option>
          <option value="legendary">Lendário</option>
        </select>

        <select
          value={filtro.status}
          onChange={(e) => setFiltro({ ...filtro, status: e.target.value })}
          className="filtro-select"
        >
          <option value="">Status</option>
          <option value="novo"> Novos</option>
          <option value="loja"> À Venda</option>
          <option value="promocao"> Em Promoção</option>
          <option value="bundle"> Bundles</option>
        </select>

        <div className="data-filtro">
          <label>De:</label>
          <input
            type="date"
            value={filtro.dataInicio}
            onChange={(e) => setFiltro({ ...filtro, dataInicio: e.target.value })}
            className="filtro-date"
          />
          <label>Até:</label>
          <input
            type="date"
            value={filtro.dataFim}
            onChange={(e) => setFiltro({ ...filtro, dataFim: e.target.value })}
            className="filtro-date"
          />
        </div>
      </div>

      {/* 🔹 Listagem */}
      <div className="grid-cosmeticos">
        {cosmeticosPaginados.map((item) => (
          <CosmeticoCard key={item._id} item={item} />
        ))}
        {cosmeticosPaginados.length === 0 && (
          <p className="sem-resultados">Nenhum cosmético encontrado</p>
        )}
      </div>

    
      <Paginacao
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        onMudarPagina={handleMudarPagina}
      />
    </div>
  );
}