import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import CosmeticoCard from "../components/CosmeticoCard";
import Paginacao from "../components/Paginacao";
import "../style/Loja.css";

export default function Loja() {
  const navigate = useNavigate();
  const [cosmeticos, setCosmeticos] = useState([]);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 24;
  const [filtro, setFiltro] = useState({
    nome: "",
    tipo: "",
    raridade: "",
    dataInicio: "",
    dataFim: "",
  });

  // 🔹 Bloqueia acesso se não estiver logado
  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (!user) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  // 🔹 Carrega cosméticos
  useEffect(() => {
    async function carregarCosmeticos() {
      try {
        const resposta = await api.get("/cosmeticos");
        setCosmeticos(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar cosméticos:", erro);
      }
    }
    carregarCosmeticos();
  }, []);

  // 🔹 Filtragem local
  const cosmeticosFiltrados = cosmeticos.filter((item) => {
    const nomeMatch = item.nome.toLowerCase().includes(filtro.nome.toLowerCase());
    const tipoMatch = filtro.tipo ? item.tipo === filtro.tipo : true;
    const raridadeMatch = filtro.raridade ? item.raridade === filtro.raridade : true;

    const dataItem = new Date(item.createdAt);
    const inicioMatch = filtro.dataInicio ? dataItem >= new Date(filtro.dataInicio) : true;
    const fimMatch = filtro.dataFim ? dataItem <= new Date(filtro.dataFim) : true;

    return nomeMatch && tipoMatch && raridadeMatch && inicioMatch && fimMatch;
  });

  // 🔹 Paginação
  const totalPaginas = Math.ceil(cosmeticosFiltrados.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const cosmeticosPaginados = cosmeticosFiltrados.slice(indiceInicial, indiceInicial + itensPorPagina);

  const irParaPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => setPaginaAtual(1), [filtro]);

  // 🔹 Páginas exibidas
  const gerarPaginasExibidas = () => {
    const paginas = [];
    const MAX_PAGINAS_EXIBIDAS = 5;
    let inicio = Math.max(1, paginaAtual - Math.floor(MAX_PAGINAS_EXIBIDAS / 2));
    let fim = Math.min(totalPaginas, inicio + MAX_PAGINAS_EXIBIDAS - 1);
    if (fim - inicio < MAX_PAGINAS_EXIBIDAS - 1) {
      inicio = Math.max(1, fim - MAX_PAGINAS_EXIBIDAS + 1);
    }
    if (inicio > 1) {
      paginas.push(1);
      if (inicio > 2) paginas.push("...");
    }
    for (let i = inicio; i <= fim; i++) paginas.push(i);
    if (fim < totalPaginas) {
      if (fim < totalPaginas - 1) paginas.push("...");
      paginas.push(totalPaginas);
    }
    return paginas;
  };

  const paginasExibidas = gerarPaginasExibidas();

  return (
    <div className="loja-container">
      {/* 🔹 Filtros */}
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
          <p className="sem-resultados">Nenhum cosmético encontrado 😢</p>
        )}
      </div>

      {/* 🔹 Paginação */}
      {totalPaginas > 1 && (
        <div className="paginacao-container">
          <button className="btn-paginacao" onClick={() => irParaPagina(paginaAtual - 1)} disabled={paginaAtual === 1}>
             Anterior
          </button>

          {paginasExibidas.map((pagina, i) =>
            pagina === "..." ? (
              <span key={`ellipsis-${i}`} className="reticencias">...</span>
            ) : (
              <button
                key={`page-${pagina}`}
                className={`btn-paginacao ${paginaAtual === pagina ? "ativo" : ""}`}
                onClick={() => irParaPagina(pagina)}
              >
                {pagina}
              </button>
            )
          )}

          <button
            className="btn-paginacao"
            onClick={() => irParaPagina(paginaAtual + 1)}
            disabled={paginaAtual === totalPaginas}
          >
            Próxima 
          </button>
        </div>
      )}
    </div>
  );
}