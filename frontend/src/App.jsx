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
import Perfil from "./pages/Perfil";
import Navbar from "./components/Navbar";
import CosmeticoDetalhe from "./pages/CosmeticoDetalhe";




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
  const isLoginPage = location.pathname === "/" || location.pathname === "/login";

  const videoId = "AlABOZhCCqU";
  const videoSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0&modestbranding=1`;

  return (
    <>
      {/* 🔹 Exibe o vídeo de fundo só na página de login */}
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

      {/* 🔹 Esconde a Navbar na tela de login */}
      { <Navbar />}

      <div className={`container ${isLoginPage ? "login-active" : ""}`}>
        <Routes>
          {/* 🔹 Login (página inicial) */}
          <Route path="/" element={<Login />} />

          {/* 🔹 Loja (só acessa se estiver logado) */}
          <Route
            path="/loja"
            element={usuario ? <Loja /> : <Navigate to="/" replace />}
          />

          {/* 🔹 Outras páginas (também protegidas) */}
          <Route
           path="/cosmetico/:id" 
           element={<CosmeticoDetalhe />}
           />

          <Route
            path="/historico"
            element={usuario ? <Historico /> : <Navigate to="/" replace />}
          />
          <Route
            path="/perfil"
            element={usuario ? <Perfil /> : <Navigate to="/" replace />}
          />

          {/* 🔹 Rota inválida → redireciona para login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
