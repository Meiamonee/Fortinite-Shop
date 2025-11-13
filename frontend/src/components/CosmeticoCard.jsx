import { useNavigate } from "react-router-dom";
import "../style/CosmeticoCard.css";
import vbucksIcon from "../assets/v-bucks.png";

export default function CosmeticoCard({ item }) {
  const navigate = useNavigate();

  // 🔹 Proteção contra item undefined
  if (!item) {
    console.error("❌ CosmeticoCard recebeu item undefined");
    return null;
  }

  console.log("🎮 CosmeticoCard renderizando:", item); // 🔹 DEBUG

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
    console.log("🔍 Navegando para cosmético:", itemId); // 🔹 DEBUG
    navigate(`/cosmetico/${itemId}`);
  };

  return (
    <div className={`card-cosmetico ${item.raridade || ""}`}>
      {item.status === "novo" && <div className="badge-novo">NOVO</div>}

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
            <span className="valor">{item.preco || 0}</span>
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