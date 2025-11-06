import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

export default function Login() {
  const [modo, setModo] = useState("login"); // 'login' ou 'registrar'
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const alternarModo = () => {
    setModo(modo === "login" ? "registrar" : "login");
    setNome("");
    setEmail("");
    setSenha("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (modo === "login") {
        const resposta = await api.post("/auth/login", { email, senha });
        localStorage.setItem("usuario", JSON.stringify(resposta.data.usuario));

        // 🔹 Dispara evento global para a Navbar atualizar automaticamente
        window.dispatchEvent(new Event("usuarioChange"));

        navigate("/loja");
      } else {
        await api.post("/auth/registrar", { name: nome, email, senha });
        alert("Conta criada com sucesso! Faça login.");
        setModo("login");
      }
    } catch (erro) {
      alert(
        modo === "login"
          ? "Erro ao fazer login. Verifique suas credenciais."
          : "Erro ao registrar. Tente novamente."
      );
    }
  };

  return (
    <div className="login-container">
      <h2>{modo === "login" ? "Entre na Epic Games" : "Criar Conta"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="login-inner-box">
          {modo === "registrar" && (
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit">
            {modo === "login" ? "Entrar" : "Registrar"}
          </button>
        </div>
      </form>

      <p>
        {modo === "login" ? (
          <>
            Não tem conta?{" "}
            <span className="link" onClick={alternarModo}>
              Criar conta
            </span>
          </>
        ) : (
          <>
            Já tem conta?{" "}
            <span className="link" onClick={alternarModo}>
              Fazer login
            </span>
          </>
        )}
      </p>
    </div>
  );
}
