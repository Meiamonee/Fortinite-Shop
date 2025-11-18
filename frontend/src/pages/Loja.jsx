import { useState, useEffect } from "react";
import api from "../services/api";
import CosmeticoCard from "../components/CosmeticoCard";
import Paginacao from "../components/Paginacao"; // 🔹 IMPORTAR COMPONENTE
import "../style/Loja.css";

export default function Loja() {
  const [cosmeticos, setCosmeticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [total, setTotal] = useState(0);
  const itensPorPagina = 24;
  const [filtro, setFiltro] = useState({
    nome: "",
    tipo: "",
    raridade: "",
    status: "",
    promocao: "",
    dataInicio: "",
    dataFim: "",
  });

  // Carrega cosméticos com paginação e filtros
  useEffect(() => {
    async function carregarCosmeticos() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: paginaAtual.toString(),
          limit: itensPorPagina.toString(),
        });
        
        if (filtro.nome) params.append('nome', filtro.nome);
        if (filtro.tipo) params.append('tipo', filtro.tipo);
        if (filtro.raridade) params.append('raridade', filtro.raridade);
        if (filtro.status) params.append('status', filtro.status);
        if (filtro.promocao === "true") params.append('promocao', 'true');
        
        console.log("Carregando cosméticos com filtros:", Object.fromEntries(params));
        
        const resposta = await api.get(`/cosmeticos?${params.toString()}`);
        
        if (resposta.data.cosmeticos) {
          setCosmeticos(resposta.data.cosmeticos);
          setTotalPaginas(resposta.data.totalPaginas || 1);
          setTotal(resposta.data.total || 0);
          
          console.log(`Cosméticos carregados: ${resposta.data.cosmeticos.length} de ${resposta.data.total} total`);
          
          const emPromocao = resposta.data.cosmeticos.filter(item => 
            item.regularPrice && item.preco && item.regularPrice > item.preco
          );
          if (emPromocao.length > 0) {
            console.log(`Itens em promoção nesta página: ${emPromocao.length}`);
          }
        } else {
          setCosmeticos(resposta.data);
        }
      } catch (erro) {
        console.error("Erro ao carregar cosméticos:", erro);
      } finally {
        setLoading(false);
      }
    }
    carregarCosmeticos();
  }, [paginaAtual, filtro.nome, filtro.tipo, filtro.raridade, filtro.status, filtro.promocao]);

  // Filtragem local apenas para data (backend não suporta ainda)
  const cosmeticosFiltrados = cosmeticos.filter((item) => {
    if (!filtro.dataInicio && !filtro.dataFim) return true;
    
    const dataItem = new Date(item.createdAt);
    const inicioMatch = filtro.dataInicio ? dataItem >= new Date(filtro.dataInicio) : true;
    const fimMatch = filtro.dataFim ? dataItem <= new Date(filtro.dataFim) : true;
    
    return inicioMatch && fimMatch;
  });

  // Não precisa mais filtrar bundles client-side, o backend já faz isso
  const cosmeticosFinais = cosmeticosFiltrados;

  const handleMudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setPaginaAtual(1);
  }, [filtro.nome, filtro.tipo, filtro.raridade, filtro.status, filtro.promocao]);

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
          onChange={(e) => {
            const novoStatus = e.target.value;
            setFiltro({ 
              ...filtro, 
              status: novoStatus === "promocao" ? "" : novoStatus,
              promocao: novoStatus === "promocao" ? "true" : ""
            });
          }}
          className="filtro-select"
        >
          <option value="">Status</option>
          <option value="novo">Novos</option>
          <option value="loja">À Venda</option>
          <option value="promocao">Em Promoção</option>
          <option value="bundle">Bundles</option>
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

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando cosméticos...</p>
        </div>
      ) : (
        <>
          <div className="info-resultados">
            <p>Total: {total} cosméticos</p>
          </div>
          
          <div className="grid-cosmeticos">
            {cosmeticosFinais.map((item) => (
              <CosmeticoCard key={item._id} item={item} />
            ))}
            {cosmeticosFinais.length === 0 && (
              <p className="sem-resultados">Nenhum cosmético encontrado</p>
            )}
          </div>

          <Paginacao
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            onMudarPagina={handleMudarPagina}
          />
        </>
      )}
    </div>
  );
}