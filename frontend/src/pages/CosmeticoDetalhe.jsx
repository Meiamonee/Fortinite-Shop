import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/CosmeticoDetalhe.css";

export default function CosmeticoDetalhe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cosmetico, setCosmetico] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comprando, setComprando] = useState(false);

  useEffect(() => {
    async function carregar() {
      try {
        const userString = localStorage.getItem("usuario");
        if (userString) {
          const userData = JSON.parse(userString);
          setUsuario(userData);
          console.log("✅ Usuário carregado:", userData); // DEBUG
        } else {
          console.warn("⚠️ Nenhum usuário no localStorage");
        }

        const resposta = await api.get("/cosmeticos");
        const item = resposta.data.find((c) => c._id === id);
        setCosmetico(item || null);
        console.log("✅ Cosmético carregado:", item); // DEBUG
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
      alert("Usuário ou cosmético não encontrado.");
      return;
    }

    // 🔍 DEBUG: Verificar dados antes de enviar
    const usuarioId = usuario._id || usuario.id;
    console.log("📦 Dados da compra:", {
      usuarioId: usuarioId,
      cosmeticoId: cosmetico._id,
      usuario: usuario,
      cosmetico: cosmetico,
    });

    try {
      setComprando(true);

      const payload = {
        usuarioId: usuarioId,
        cosmeticoId: cosmetico._id,
      };

      console.log("🚀 Enviando requisição POST para /compras/comprar");
      console.log("📤 Payload:", payload);

      const resposta = await api.post("/compras/comprar", payload);

      console.log("✅ Resposta recebida:", resposta.data);

      alert(resposta.data.mensagem || "Compra realizada com sucesso!");

      // Atualiza localStorage com o novo estado do usuário
      const usuarioAtualizado = {
        ...usuario,
        creditos: resposta.data.creditosRestantes,
        cosmeticosComprados: resposta.data.cosmeticosComprados,
      };
      
      localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
      setUsuario(usuarioAtualizado);
      
      // 🔥 NOTIFICA A NAVBAR E OUTROS COMPONENTES SOBRE A ATUALIZAÇÃO
      window.dispatchEvent(new Event("usuarioChange"));
      
      console.log("✅ Usuário atualizado:", usuarioAtualizado);

    } catch (erro) {
      console.error("❌ Erro completo:", erro);
      console.error("❌ Resposta do erro:", erro.response);
      console.error("❌ Dados do erro:", erro.response?.data);
      console.error("❌ Status do erro:", erro.response?.status);
      
      const mensagemErro = 
        erro.response?.data?.mensagem || 
        erro.response?.data?.message ||
        erro.message ||
        "Erro ao realizar compra. Tente novamente.";
      
      alert(mensagemErro);
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
        <p className="texto-central">Cosmético não encontrado.</p>
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

          <div className="detalhe-preco">🎮 {cosmetico.preco} V-Bucks</div>

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

            <button className="btn-voltar" onClick={() => navigate("/loja")}>
              Voltar à Loja
            </button>
          </div>
        </div>

        <div className="detalhe-imagem">
          <img src={cosmetico.imagem} alt={cosmetico.nome} />
        </div>
      </div>
    </div>
  );
}