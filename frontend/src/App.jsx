import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Loja from "./pages/Loja";
import Historico from "./pages/Historico";
import Navbar from "./components/Navbar";
import CosmeticoDetalhe from "./pages/CosmeticoDetalhe";
import UsuariosPublicos from "./pages/UsuariosPublicos";
import PerfilPublico from "./pages/PerfilPublico";




import "./App.css";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const usuario = localStorage.getItem("usuario");

  // Identifica se é a página de login
  const isLoginPage = location.pathname === "/login";

  const videoId = "AlABOZhCCqU";
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1`;

  return (
    <>
      {isLoginPage && (
        <div className="video-background-container">
          <iframe
            className="video-background-iframe"
            width="100%"
            height="100%"
            src={videoSrc}
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          ></iframe>

          <div className="video-overlay-gradient"></div>
        </div>
      )}

      {/* 🔹 Navbar sempre visível */}
      <Navbar />

      <div className={`container ${isLoginPage ? "login-active" : ""}`}>
        <Routes>
          {/* 🔹 Loja (página inicial - acessível sem login) */}
          <Route path="/" element={<Loja />} />

          {/* 🔹 Login */}
          <Route path="/login" element={<Login />} />

          {/* 🔹 Detalhes do cosmético (acessível sem login) */}
          <Route path="/cosmetico/:id" element={<CosmeticoDetalhe />} />

          {/* 🔹 Páginas públicas */}
          <Route path="/usuarios" element={<UsuariosPublicos />} />
          <Route path="/usuario/:id" element={<PerfilPublico />} />

          {/* 🔹 Histórico (protegido - só logados) */}
          <Route
            path="/historico"
            element={usuario ? <Historico /> : <Navigate to="/login" replace />}
          />

          {/* 🔹 Rota inválida → redireciona para loja */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
