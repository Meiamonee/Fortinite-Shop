import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import vbucksIcon from "../assets/v-bucks.png"; // 🔹 IMPORTAR IMAGEM
import "../style/Navbar.css";

const SearchIcon = () => <span className="icon search-icon">🔍</span>;

export default function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  const atualizarUsuario = () => {
    const user = localStorage.getItem("usuario");
    setUsuario(user ? JSON.parse(user) : null);
  };

  useEffect(() => {
    atualizarUsuario();

    window.addEventListener("storage", atualizarUsuario);
    window.addEventListener("usuarioChange", atualizarUsuario);

    return () => {
      window.removeEventListener("storage", atualizarUsuario);
      window.removeEventListener("usuarioChange", atualizarUsuario);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    window.dispatchEvent(new Event("usuarioChange"));
    navigate("/"); // Redireciona para a loja (página inicial)
  };

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <Link to="/" className="logo-link fortnite-logo">
          <img src={Logo} alt="Fortnite Shop Logo" className="logo-image" />
        </Link>

        <nav className="nav-links">
          <Link to="/">Loja</Link>
          <Link to="/usuarios">Usuários</Link>
          {usuario && <Link to="/historico">Histórico</Link>}
        </nav>
      </div>

      <div className="navbar-right">
        {usuario && (
          <div className="creditos">
            <img src={vbucksIcon} alt="V-Bucks" className="vbucks-navbar-icon" />
            <strong>{usuario.creditos}</strong>
          </div>
        )}

        {!usuario ? (
          <Link to="/login" className="btn btn-login">
            Entrar
          </Link>
        ) : (
          <button onClick={handleLogout} className="btn btn-logout">
            Sair
          </button>
        )}
      </div>
    </header>
  );
}