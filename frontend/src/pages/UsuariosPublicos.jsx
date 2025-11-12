import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import vbucksIcon from "../assets/v-bucks.png";
import Paginacao from "../components/Paginacao"; // 🔹 IMPORTAR COMPONENTE
import "../style/UsuariosPublicos.css";

export default function UsuariosPublicos() {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    carregarUsuarios();
  }, [paginaAtual]);

  const carregarUsuarios = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/usuarios/publicos?page=${paginaAtual}&limit=12`);
      setUsuarios(data.usuarios);
      setTotalPaginas(data.totalPaginas);
    } catch (erro) {
      console.error("Erro ao carregar usuários:", erro);
    } finally {
      setLoading(false);
    }
  };

  const usuariosFiltrados = usuarios.filter(usuario =>
    usuario.name.toLowerCase().includes(busca.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busca.toLowerCase())
  );

  // 🔹 Função para mudar de página
  const handleMudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  if (loading) {
    return (
      <div className="usuarios-container">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h1>Perfils de Usuário</h1>
        <p>Explore os perfis dos jogadores e veja suas coleções!</p>
      </div>

      <div className="busca-container">
        <input
          type="text"
          placeholder="🔍 Buscar por nome ou email..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="busca-input"
        />
      </div>

      <div className="usuarios-grid">
        {usuariosFiltrados.map((usuario) => (
          <div
            key={usuario._id}
            className="usuario-card"
            onClick={() => navigate(`/usuario/${usuario._id}`)}
          >
            <div className="usuario-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            
            <div className="usuario-info">
              <h3 className="usuario-nome">{usuario.name}</h3>
              <p className="usuario-email">{usuario.email}</p>
              
              <div className="usuario-stats">
                <div className="stat-item">
                  <img src={vbucksIcon} alt="V-Bucks" className="stat-icon-img" />
                  <span className="stat-value">{usuario.creditos}</span>
                  <span className="stat-label">V-Bucks</span>
                </div>
                
                <div className="stat-item">
                  <span className="stat-icon">🎁</span>
                  <span className="stat-value">{usuario.cosmeticosComprados?.length || 0}</span>
                  <span className="stat-label">Itens</span>
                </div>
              </div>
            </div>

            <div className="usuario-footer">
              <button className="btn-ver-perfil">
                Ver Coleção 
              </button>
            </div>
          </div>
        ))}

        {usuariosFiltrados.length === 0 && (
          <p className="sem-resultados">Nenhum usuário encontrado 😢</p>
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