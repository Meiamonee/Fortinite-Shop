import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../style/CosmeticoCard.css";
import vbucksIcon from "../assets/v-bucks.png";

export default function CosmeticoCard({ item }) {
  const navigate = useNavigate();
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [jaAdquirido, setJaAdquirido] = useState(false);

  // 🔹 Proteção contra item undefined
  if (!item) {
    return null;
  }

  // 🔹 Verifica se o usuário está logado e se já adquiriu o item
  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (user) {
      const userData = JSON.parse(user);
      setUsuarioLogado(userData);
      
      // Verifica se o cosmético está na lista de comprados
      if (userData.cosmeticosComprados && Array.isArray(userData.cosmeticosComprados)) {
        const possui = userData.cosmeticosComprados.some(
          (id) => id === item._id || id === item.id
        );
        setJaAdquirido(possui);
      }
    }

    // Escuta mudanças no usuário
    const handleUserChange = () => {
      const updatedUser = localStorage.getItem("usuario");
      if (updatedUser) {
        const userData = JSON.parse(updatedUser);
        setUsuarioLogado(userData);
        if (userData.cosmeticosComprados && Array.isArray(userData.cosmeticosComprados)) {
          const possui = userData.cosmeticosComprados.some(
            (id) => id === item._id || id === item.id
          );
          setJaAdquirido(possui);
        }
      } else {
        setUsuarioLogado(null);
        setJaAdquirido(false);
      }
    };

    window.addEventListener("usuarioChange", handleUserChange);
    return () => window.removeEventListener("usuarioChange", handleUserChange);
  }, [item._id, item.id]);

  const obterCorRaridade = (raridade) => {
    const cores = {
      common: "#94D5FF",
      rare: "#00D9FF",
      epic: "#9D4EDD",
      legendary: "#FFB703",
    };
    return cores[raridade] || "#94D5FF";
  };

  const obterRaridadePT = (raridade) => {
    const raridades = {
      common: "Comum",
      rare: "Raro",
      epic: "Épico",
      legendary: "Lendário",
    };
    return raridades[raridade] || raridade;
  };

  const handleVerDetalhes = (e) => {
    e.stopPropagation();
    const itemId = item._id || item.id;
    navigate(`/cosmetico/${itemId}`);
  };

  // Verificar se está em promoção
  const emPromocao = item.regularPrice && item.preco && item.regularPrice > item.preco;

  return (
    <div className={`card-cosmetico ${item.raridade || ""}`}>
      {/* 🔹 Badges Indicativos */}
      <div className="badges-container">
        {item.isBundle && <div className="badge badge-bundle">BUNDLE</div>}
        {item.status === "novo" && <div className="badge badge-novo">NOVO</div>}
        {item.status === "loja" && <div className="badge badge-loja">À VENDA</div>}
        {emPromocao && <div className="badge badge-promocao">PROMOÇÃO</div>}
        {jaAdquirido && <div className="badge badge-adquirido">ADQUIRIDO</div>}
      </div>

      <div className="card-imagem">
        <img src={item.imagem} alt={item.nome || "Cosmético"} />
      </div>

      <div className="card-info">
        <h3 className="card-titulo">{item.nome || "Sem nome"}</h3>

        <div className="card-detalhes">
          <span className="card-tipo">{item.tipo || "Desconhecido"}</span>
          <span
            className="card-raridade"
            style={{ borderColor: obterCorRaridade(item.raridade) }}
          >
            {obterRaridadePT(item.raridade)}
          </span>
        </div>

        <div className="card-footer">
          <div className="card-preco">
            <img src={vbucksIcon} alt="V-Bucks" className="icone-vbucks" />
            {emPromocao ? (
              <div className="preco-promocao">
                <span className="preco-original">{item.regularPrice}</span>
                <span className="valor preco-desconto">{item.preco || 0}</span>
              </div>
            ) : (
              <span className="valor">{item.preco || 0}</span>
            )}
          </div>
        </div>

        <button
          className="btn-detalhes"
          onClick={handleVerDetalhes}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}