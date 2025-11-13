import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import vbucksIcon from "../assets/v-bucks.png";
import "../style/CosmeticoDetalhe.css";

export default function CosmeticoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cosmetico, setCosmetico] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comprando, setComprando] = useState(false);
  const [mensagemCompra, setMensagemCompra] = useState("");

  useEffect(() => {
    async function carregar() {
      try {
        const userString = localStorage.getItem("usuario");
        if (userString) {
          const userData = JSON.parse(userString);
          setUsuario(userData);
        }

        const resposta = await api.get("/cosmeticos");
        const item = resposta.data.find((c) => c._id === id);
        
        console.log("🔍 Cosmético encontrado:", item); // 🔹 DEBUG
        
        setCosmetico(item || null);
      } catch (erro) {
        console.error("❌ Erro ao carregar cosmético:", erro);
      } finally {
        setLoading(false);
      }
    }

    carregar();
  }, [id]);

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

  const comprarItem = async () => {
    if (!usuario || !cosmetico) {
      setMensagemCompra("Usuário ou cosmético não encontrado.");
      setTimeout(() => setMensagemCompra(""), 4000);
      return;
    }

    const usuarioId = usuario._id || usuario.id;

    try {
      setComprando(true);

      const payload = {
        usuarioId: usuarioId,
        cosmeticoId: cosmetico._id,
      };

      const resposta = await api.post("/compras/comprar", payload);

      setMensagemCompra(resposta.data.mensagem || "Compra realizada com sucesso!");
      setTimeout(() => setMensagemCompra(""), 4000);

      const usuarioAtualizado = {
        ...usuario,
        creditos: resposta.data.creditosRestantes,
        cosmeticosComprados: resposta.data.cosmeticosComprados,
      };

      localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
      setUsuario(usuarioAtualizado);
      window.dispatchEvent(new Event("usuarioChange"));
    } catch (erro) {
      console.error("❌ Erro completo:", erro);
      const mensagemErro =
        erro.response?.data?.mensagem ||
        erro.response?.data?.message ||
        erro.message ||
        "Erro ao realizar compra. Tente novamente.";

      setMensagemCompra(mensagemErro);
      setTimeout(() => setMensagemCompra(""), 4000);
    } finally {
      setComprando(false);
    }
  };

  if (loading)
    return (
      <div className="detalhe-bg">
        <div className="detalhe-loading">
          <div className="spinner"></div>
          <p>Carregando detalhes...</p>
        </div>
      </div>
    );

  if (!cosmetico)
    return (
      <div className="detalhe-bg">
        <div className="detalhe-erro">
          <p className="texto-central">Cosmético não encontrado.</p>
          <button className="btn-voltar" onClick={() => navigate(-1)}>
             Voltar
          </button>
        </div>
      </div>
    );

  const jaAdquirido = usuario?.cosmeticosComprados?.includes(cosmetico._id);
  const icones = [];
  if (cosmetico.status === "novo") icones.push({ emoji: "🆕", texto: "Novo" });
  if (cosmetico.status === "loja") icones.push({ emoji: "🛒", texto: "À venda" });
  if (jaAdquirido) icones.push({ emoji: "✅", texto: "Adquirido" });

  return (
    <div className="detalhe-bg">
      <div className="detalhe-conteudo">
        <div className="detalhe-info">
          <h2 className="titulo">{cosmetico.nome}</h2>

          <div
            className="detalhe-raridade"
            style={{ borderColor: obterCorRaridade(cosmetico.raridade) }}
          >
            {obterRaridadePT(cosmetico.raridade)}
          </div>

          <p className="detalhe-tipo">Tipo: {cosmetico.tipo}</p>

          <div className="detalhe-preco">
            <img src={vbucksIcon} alt="V-Bucks" className="vbucks-icone-grande" />
            <span>{cosmetico.preco} V-Bucks</span>
          </div>

          {icones.length > 0 && (
            <div className="detalhe-icones">
              {icones.map((icon, i) => (
                <span
                  key={i}
                  className={`badge ${
                    icon.texto === "Novo"
                      ? "badge-novo"
                      : icon.texto === "À venda"
                      ? "badge-loja"
                      : "badge-adquirido"
                  }`}
                >
                  {icon.emoji} {icon.texto}
                </span>
              ))}
            </div>
          )}

          <div className="botoes">
            {usuario ? (
              <button
                className={`btn-comprar ${jaAdquirido ? "btn-desabilitado" : ""}`}
                onClick={comprarItem}
                disabled={jaAdquirido || comprando}
              >
                {jaAdquirido
                  ? "Já Adquirido"
                  : comprando
                  ? "Processando..."
                  : "Comprar"}
              </button>
            ) : (
              <button className="btn-login" onClick={() => navigate("/")}>
                Fazer Login para Comprar
              </button>
            )}

            <button className="btn-voltar" onClick={() => navigate(-1)}>
               Voltar
            </button>
          </div>
        </div>

        <div className="detalhe-imagem">
          <img src={cosmetico.imagem} alt={cosmetico.nome} />
        </div>
      </div>

      {mensagemCompra && (
        <div
          className={`notificacao ${
            mensagemCompra.toLowerCase().includes("erro") ? "erro" : "sucesso"
          }`}
        >
          {mensagemCompra}
        </div>
      )}
    </div>
  );
}