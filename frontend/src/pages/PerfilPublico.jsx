import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import CosmeticoCard from "../components/CosmeticoCard";
import vbucksIcon from "../assets/v-bucks.png";
import "../style/PerfilPublico.css";

export default function PerfilPublico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cosmeticos, setCosmeticos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 12;

  useEffect(() => {
    carregarPerfil();
  }, [id]);

  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/usuarios/${id}/cosmeticos`);
      console.log("📦 Dados recebidos:", data); // 🔹 Debug
      setUsuario(data.usuario);
      setCosmeticos(data.cosmeticos);
    } catch (erro) {
      console.error("Erro ao carregar perfil:", erro);
    } finally {
      setLoading(false);
    }
  };

  const totalPaginas = Math.ceil(cosmeticos.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const cosmeticosPaginados = cosmeticos.slice(indiceInicial, indiceInicial + itensPorPagina);

  const irParaPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

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

  if (loading) {
    return (
      <div className="perfil-publico-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="perfil-publico-container">
        <p className="erro-mensagem">Usuário não encontrado</p>
        <button onClick={() => navigate("/usuarios")} className="btn-voltar">
          ← Voltar para Usuários
        </button>
      </div>
    );
  }

  return (
    <div className="perfil-publico-container">
      <button onClick={() => navigate("/usuarios")} className="btn-voltar-top">
        ← Voltar
      </button>

      <div className="perfil-header">
        <div className="perfil-avatar-grande">
          <span className="avatar-icon-grande">👤</span>
        </div>
        
        <div className="perfil-info-principal">
          <h1 className="perfil-nome">{usuario.nome}</h1>
          <p className="perfil-email">{usuario.email}</p>
          
          <div className="perfil-stats-grid">
            <div className="stat-card">
              <img src={vbucksIcon} alt="V-Bucks" className="stat-icon-perfil" />
              <div className="stat-detalhes">
                <span className="stat-numero">{usuario.creditos}</span>
                <span className="stat-titulo">V-Bucks</span>
              </div>
            </div>
            
            <div className="stat-card">
              <span className="stat-icon-grande">🎁</span>
              <div className="stat-detalhes">
                <span className="stat-numero">{cosmeticos.length}</span>
                <span className="stat-titulo">Itens na Coleção</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="colecao-secao">
        <h2 className="secao-titulo">🏆 Coleção de Cosméticos</h2>
        
        {cosmeticos.length === 0 ? (
          <p className="colecao-vazia">Este usuário ainda não possui itens na coleção 📦</p>
        ) : (
          <>
            <div className="colecao-grid">
              {cosmeticosPaginados.map((item) => {
                console.log("🎮 Renderizando item:", item); // 🔹 Debug
                return (
                  <CosmeticoCard 
                    key={item._id || item.id} 
                    item={item} 
                  />
                );
              })}
            </div>

            {totalPaginas > 1 && (
              <div className="paginacao-container">
                <button 
                  className="btn-paginacao" 
                  onClick={() => irParaPagina(paginaAtual - 1)} 
                  disabled={paginaAtual === 1}
                >
                  ← Anterior
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
                  Próxima →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}