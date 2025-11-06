import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Loja from "./pages/Loja";
import Inventario from "./pages/Inventario";
import Historico from "./pages/Historico";
import Perfil from "./pages/Perfil";
import Navbar from "./components/Navbar";

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
  const isLoginPage = location.pathname === "/";

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
    
      <Navbar />

      <div className={`container ${isLoginPage ? 'login-active' : ''}`}>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/inventario" element={<Inventario />} />
          <Route path="/historico" element={<Historico />} />
          <Route path="/perfil" element={<Perfil />} />
        </Routes>
      </div>
    </>
  );
}

export default App;