import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Paginacao from "../components/Paginacao";
import "../style/Historico.css";

export default function Historico() {
  const [historico, setHistorico] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensagem, setMensagem] = useState("");
  const [processandoReembolso, setProcessandoReembolso] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;
  const navigate = useNavigate();

  // Calcular paginação
  const totalPaginas = Math.ceil(historico.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const historicoPaginado = historico.slice(indiceInicial, indiceInicial + itensPorPagina);

  // Função para mudar de página
  const handleMudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina);
  };

  // Buscar histórico do usuário
  const buscarHistorico = async (usuarioId) => {
    setLoading(true);
    try {
      const resposta = await api.get(`/compras/historico/${usuarioId}`);
      setHistorico(resposta.data || []);
    } catch (erro) {
      console.error("Erro ao buscar histórico:", erro);
      setMensagem("Erro ao carregar histórico.");
      setTimeout(() => setMensagem(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados quando a página abre
  useEffect(() => {
    const usuarioString = localStorage.getItem("usuario");
    if (!usuarioString) {
      navigate("/login");
      return;
    }

    const usuarioObj = JSON.parse(usuarioString);
    setUsuario(usuarioObj);

    const usuarioId = usuarioObj._id || usuarioObj.id;
    if (usuarioId) {
      buscarHistorico(usuarioId);
    } else {
      setLoading(false);
    }
  }, []);

  // Função para reembolsar item
  const handleReembolso = async (cosmeticoId) => {
    if (!usuario || !cosmeticoId) {
      setMensagem("Dados inválidos para reembolso.");
      setTimeout(() => setMensagem(""), 3000);
      return;
    }

    const usuarioId = usuario._id || usuario.id;
    
    // Confirmar com o usuário
    if (!window.confirm("Tem certeza que deseja solicitar o reembolso deste item?")) {
      return;
    }

    setProcessandoReembolso(cosmeticoId);

    try {
      const resposta = await api.post("/compras/reembolso", {
        usuarioId,
        cosmeticoId,
      });

      setMensagem(resposta.data.mensagem || "Reembolso realizado com sucesso!");
      setTimeout(() => setMensagem(""), 3000);

      // Atualizar dados do usuário no localStorage
      if (resposta.data.creditosRestantes !== undefined) {
        const usuarioAtualizado = {
          ...usuario,
          creditos: resposta.data.creditosRestantes,
          cosmeticosComprados: resposta.data.cosmeticosComprados,
        };
        localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
        setUsuario(usuarioAtualizado);
        window.dispatchEvent(new Event("usuarioChange"));
      }

      // Recarregar histórico
      await buscarHistorico(usuarioId);
      
    } catch (erro) {
      console.error("Erro ao reembolsar:", erro);
      const msg = erro.response?.data?.mensagem || "Erro ao processar o reembolso.";
      setMensagem(msg);
      setTimeout(() => setMensagem(""), 4000);
    } finally {
      setProcessandoReembolso(null);
    }
  };

  // Verificar se um item já foi reembolsado
  const jaFoiReembolsado = (cosmeticoId) => {
    // Percorre o histórico procurando reembolsos deste item
    for (let i = 0; i < historico.length; i++) {
      if (historico[i].tipo === "reembolso" && historico[i].cosmetico?._id === cosmeticoId) {
        return true;
      }
    }
    return false;
  };

  // Mostrar loading enquanto carrega
  if (loading) {
    return (
      <div className="historico-container">
        <div className="historico-loading">
          <div className="spinner"></div>
          <p className="mensagem-vazia">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  // Verificar se tem usuário
  if (!usuario) {
    return (
      <div className="historico-container">
        <p className="mensagem-vazia">Usuário não autenticado.</p>
      </div>
    );
  }

  return (
    <div className="historico-container">
      <h1 className="titulo-historico">Histórico de Compras e Reembolsos</h1>

      {historico.length === 0 ? (
        <p className="mensagem-vazia">Nenhuma transação encontrada.</p>
      ) : (
        <>
          <div className="historico-lista">
            {historicoPaginado.map((item, index) => {
              const tipoTransacao = item.tipo?.toLowerCase() || "compra";
              const cosmeticoId = item.cosmetico?._id;
              const reembolsado = jaFoiReembolsado(cosmeticoId);
              const estaProcessando = processandoReembolso === cosmeticoId;

              return (
                <div
                  key={item._id || `historico-${index}`}
                  className={`historico-item ${tipoTransacao === "compra" ? "compra" : "reembolso"}`}
                >
                  <div className="historico-imagem">
                    {item.cosmetico?.imagem ? (
                      <img src={item.cosmetico.imagem} alt={item.cosmetico.nome || "Cosmético"} />
                    ) : (
                      <div className="sem-imagem">📦</div>
                    )}
                  </div>

                  <div className="historico-info">
                    <h3>{item.cosmetico?.nome || "Item desconhecido"}</h3>
                    <p>
                      <strong>Tipo:</strong>{" "}
                      <span className={tipoTransacao === "compra" ? "badge-compra" : "badge-reembolso"}>
                        {tipoTransacao === "compra" ? " Compra" : " Reembolso"}
                      </span>
                    </p>
                    <p>
                      <strong>Valor:</strong> {item.valor} V-Bucks
                    </p>
                    <p>
                      <strong>Data:</strong> {item.data}
                    </p>
                  </div>

                  {/* Mostrar botão de reembolso apenas para compras que não foram reembolsadas */}
                  {tipoTransacao === "compra" && !reembolsado && (
                    <button
                      className="botao-reembolso"
                      onClick={() => handleReembolso(cosmeticoId)}
                      disabled={estaProcessando}
                    >
                      {estaProcessando ? "Processando..." : "Solicitar Reembolso"}
                    </button>
                  )}
                  
                  {tipoTransacao === "compra" && reembolsado && (
                    <div className="badge-reembolsado">Já Reembolsado</div>
                  )}
                </div>
              );
            })}
          </div>

          <Paginacao
            paginaAtual={paginaAtual}
            totalPaginas={totalPaginas}
            onMudarPagina={handleMudarPagina}
          />
        </>
      )}

      {mensagem && (
        <div className={`notificacao ${mensagem.includes("Erro") ? "erro" : "sucesso"}`}>
          {mensagem}
        </div>
      )}
    </div>
  );
}