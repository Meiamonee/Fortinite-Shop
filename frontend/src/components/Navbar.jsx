import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.png";
import "../style/Navbar.css";

const SearchIcon = () => <span className="icon search-icon">🔍</span>;

export default function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);

  // 🔹 Atualiza o estado quando o usuário muda (login/logout)
  const atualizarUsuario = () => {
    const user = localStorage.getItem("usuario");
    setUsuario(user ? JSON.parse(user) : null);
  };

  useEffect(() => {
    atualizarUsuario();

    // 🔹 Escuta mudanças vindas de outras partes da aplicação
    window.addEventListener("storage", atualizarUsuario);
    window.addEventListener("usuarioChange", atualizarUsuario);

    return () => {
      window.removeEventListener("storage", atualizarUsuario);
      window.removeEventListener("usuarioChange", atualizarUsuario);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");

    // 🔹 Notifica que o usuário foi deslogado
    window.dispatchEvent(new Event("usuarioChange"));
    navigate("/");
  };

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <Link to="/loja" className="logo-link fortnite-logo">
          <img src={Logo} alt="Fortnite Shop Logo" className="logo-image" />
        </Link>

        {usuario && (
          <nav className="nav-links">
            <Link to="/loja">Loja</Link>
            <Link to="/inventario">Inventário</Link>
            <Link to="/historico">Histórico</Link>
            <Link to="/perfil">Perfil</Link>
          </nav>
        )}
      </div>

      <div className="navbar-right">
        {usuario && (
          <div className="search-box">
            <SearchIcon />
            <input type="text" placeholder="Procurar..." />
          </div>
        )}

        {usuario && (
          <div className="creditos">
            <span className="vbucks">V-Bucks:</span>{" "}
            <strong>{usuario.creditos}</strong>
          </div>
        )}

        {!usuario ? (
          <Link to="/" className="btn btn-login">
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
