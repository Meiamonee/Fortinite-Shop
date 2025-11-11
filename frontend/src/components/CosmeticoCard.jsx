import { useNavigate } from "react-router-dom";
import "../style/CosmeticoCard.css"; // CSS específico do card

export default function CosmeticoCard({ item }) {
  const navigate = useNavigate();

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

  return (
    <div className={`card-cosmetico ${item.raridade}`}>
      {item.status === "novo" && <div className="badge-novo">NOVO</div>}

      <div className="card-imagem">
        <img src={item.imagem} alt={item.nome} />
      </div>

      <div className="card-info">
        <h3 className="card-titulo">{item.nome}</h3>

        <div className="card-detalhes">
          <span className="card-tipo">{item.tipo}</span>
          <span
            className="card-raridade"
            style={{ borderColor: obterCorRaridade(item.raridade) }}
          >
            {obterRaridadePT(item.raridade)}
          </span>
        </div>

        <div className="card-footer">
          <div className="card-preco">
            <span className="icone-vbucks">🎮</span>
            <span className="valor">{item.preco}</span>
          </div>
        </div>

        <button
          className="btn-detalhes"
          onClick={() => navigate(`/cosmetico/${item._id}`)}
        >
          Ver Detalhes
        </button>
      </div>
    </div>
  );
}
