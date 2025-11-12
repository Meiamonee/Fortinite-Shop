// src/pages/Historico.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
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

  // Memoiza o set de itens reembolsados para evitar recalcular sempre
  const itensReembolsados = useMemo(() => {
    const reembolsados = new Set();
    historico.forEach(item => {
      if (item.tipo?.toLowerCase() === "reembolso") {
        const id = item.cosmetico?._id;
        if (id) reembolsados.add(id);
      }
    });
    return reembolsados;
  }, [historico]);

  // 🔹 Paginação
  const totalPaginas = Math.ceil(historico.length / itensPorPagina);
  const indiceInicial = (paginaAtual - 1) * itensPorPagina;
  const historicoPaginado = historico.slice(indiceInicial, indiceInicial + itensPorPagina);

  const irParaPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaAtual(pagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Reseta para página 1 quando o histórico muda
  useEffect(() => {
    setPaginaAtual(1);
  }, [historico.length]);

  // 🔹 Páginas exibidas (igual à Loja)
  const gerarPaginasExibidas = () => {
    const paginas = [];
    const MAX_PAGINAS_EXIBIDAS = 5;
    let inicio = Math.max(1, paginaAtual - Math.floor(MAX_PAGINAS_EXIBIDAS / 2));
    let fim = Math.min(totalPaginas, inicio + MAX_PAGINAS_EXIBIDAS - 1);
    
    if (fim - inicio < MAX_PAGINAS_EXIBIDAS - 1) {
      inicio = Math.max(1, fim - MAX_PAGINAS_EXIBIDAS + 1);
    }
    
    if (inicio > 1) {
      paginas.push(1);
      if (inicio > 2) paginas.push("...");
    }
    
    for (let i = inicio; i <= fim; i++) paginas.push(i);
    
    if (fim < totalPaginas) {
      if (fim < totalPaginas - 1) paginas.push("...");
      paginas.push(totalPaginas);
    }
    
    return paginas;
  };

  const paginasExibidas = gerarPaginasExibidas();

  // Função para buscar histórico otimizada com useCallback
  const buscarHistorico = useCallback(async (usuarioId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/compras/historico/${usuarioId}`);
      setHistorico(data || []);
    } catch (erro) {
      console.error("❌ Erro ao buscar histórico:", erro.response?.data || erro.message);
      setMensagem("Erro ao carregar histórico.");
      setTimeout(() => setMensagem(""), 4000);
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualiza usuário no localStorage
  const atualizarUsuarioLocal = useCallback((novosDados) => {
    const usuarioAtualizado = { ...usuario, ...novosDados };
    localStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
    setUsuario(usuarioAtualizado);
    window.dispatchEvent(new Event("usuarioChange"));
  }, [usuario]);

  // Mostra mensagem temporária
  const mostrarMensagem = useCallback((msg, tempo = 3000) => {
    setMensagem(msg);
    setTimeout(() => setMensagem(""), tempo);
  }, []);

  // Carrega usuário e histórico inicial
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
      console.error("❌ Usuário sem ID válido");
      setLoading(false);
    }
  }, [navigate, buscarHistorico]);

  // Handler de reembolso otimizado
  const handleReembolso = useCallback(async (cosmeticoId) => {
    if (!usuario || !cosmeticoId) {
      mostrarMensagem("Dados inválidos para reembolso.");
      return;
    }

    const usuarioId = usuario._id || usuario.id;
    
    if (!window.confirm("Tem certeza que deseja solicitar o reembolso deste item?")) {
      return;
    }

    setProcessandoReembolso(cosmeticoId);

    try {
      const { data } = await api.post("/compras/reembolso", {
        usuarioId,
        cosmeticoId,
      });

      mostrarMensagem(data?.mensagem || "Reembolso realizado com sucesso!");

      // Atualiza dados do usuário
      if (data?.creditosRestantes !== undefined) {
        atualizarUsuarioLocal({
          creditos: data.creditosRestantes,
          cosmeticosComprados: data.cosmeticosComprados,
        });
      }

      // Recarrega histórico
      await buscarHistorico(usuarioId);
      
    } catch (erro) {
      console.error("❌ Erro ao reembolsar:", erro.response?.data || erro.message);
      const msg = erro.response?.data?.mensagem || "Erro ao processar o reembolso.";
      mostrarMensagem(msg, 4000);
    } finally {
      setProcessandoReembolso(null);
    }
  }, [usuario, buscarHistorico, atualizarUsuarioLocal, mostrarMensagem]);

  // Renderiza item do histórico
  const renderHistoricoItem = useCallback((item, index) => {
    const itemKey = item._id || item.id || `historico-${index}`;
    const tipoTransacao = item.tipo?.toLowerCase() || "compra";
    const cosmeticoId = item.cosmetico?._id;
    const jaReembolsado = itensReembolsados.has(cosmeticoId);
    const estaProcessando = processandoReembolso === cosmeticoId;

    return (
      <div
        key={itemKey}
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
              {tipoTransacao === "compra" ? "🛒 Compra" : "💰 Reembolso"}
            </span>
          </p>
          <p>
            <strong>Valor:</strong>{" "}
            {typeof item.valor === "number" ? `${item.valor} V-Bucks` : item.valor || "—"}
          </p>
          <p>
            <strong>Data:</strong> {item.data || "—"}
          </p>
        </div>

        {/* Botão de reembolso ou badge */}
        {tipoTransacao === "compra" && !jaReembolsado && (
          <button
            className="botao-reembolso"
            onClick={() => handleReembolso(cosmeticoId)}
            disabled={!cosmeticoId || estaProcessando}
          >
            {estaProcessando ? "⏳ Processando..." : "💸 Solicitar Reembolso"}
          </button>
        )}
        
        {tipoTransacao === "compra" && jaReembolsado && (
          <div className="badge-reembolsado">✅ Já Reembolsado</div>
        )}
      </div>
    );
  }, [itensReembolsados, processandoReembolso, handleReembolso]);

  // Estados de loading e erro
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
            {historicoPaginado.map(renderHistoricoItem)}
          </div>

          {/* 🔹 Paginação */}
          {totalPaginas > 1 && (
            <div className="paginacao-container">
              <button 
                className="btn-paginacao" 
                onClick={() => irParaPagina(paginaAtual - 1)} 
                disabled={paginaAtual === 1}
              >
                 Anterior
              </button>

              {paginasExibidas.map((pagina, i) =>
                pagina === "..." ? (
                  <span key={`ellipsis-${i}`} className="reticencias">...</span>
                ) : (
                  <button
                    key={`page-${pagina}`}
                    className={`btn-paginacao ${paginaAtual === pagina ? "ativo" : ""}`}
                    onClick={() => irParaPagina(pagina)}
                  >
                    {pagina}
                  </button>
                )
              )}

              <button
                className="btn-paginacao"
                onClick={() => irParaPagina(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
              >
                Próxima 
              </button>
            </div>
          )}
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