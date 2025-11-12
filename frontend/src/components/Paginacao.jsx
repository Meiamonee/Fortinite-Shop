// src/components/Paginacao.jsx
import "../style/Paginacao.css";

export default function Paginacao({ 
  paginaAtual, 
  totalPaginas, 
  onMudarPagina,
  maxPaginasExibidas = 5 
}) {
  
  // Não exibe nada se só tiver 1 página ou menos
  if (totalPaginas <= 1) return null;

  const irParaPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      onMudarPagina(pagina);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Gera array de páginas a serem exibidas
  const gerarPaginasExibidas = () => {
    const paginas = [];
    let inicio = Math.max(1, paginaAtual - Math.floor(maxPaginasExibidas / 2));
    let fim = Math.min(totalPaginas, inicio + maxPaginasExibidas - 1);
    
    if (fim - inicio < maxPaginasExibidas - 1) {
      inicio = Math.max(1, fim - maxPaginasExibidas + 1);
    }
    
    if (inicio > 1) {
      paginas.push(1);
      if (inicio > 2) paginas.push("...");
    }
    
    for (let i = inicio; i <= fim; i++) {
      paginas.push(i);
    }
    
    if (fim < totalPaginas) {
      if (fim < totalPaginas - 1) paginas.push("...");
      paginas.push(totalPaginas);
    }
    
    return paginas;
  };

  const paginasExibidas = gerarPaginasExibidas();

  return (
    <div className="paginacao-container">
      <button 
        className="btn-paginacao" 
        onClick={() => irParaPagina(paginaAtual - 1)} 
        disabled={paginaAtual === 1}
      >
        ← Anterior
      </button>

      {paginasExibidas.map((pagina, i) =>
        pagina === "..." ? (
          <span key={`ellipsis-${i}`} className="reticencias">
            ...
          </span>
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
        Próxima →
      </button>
    </div>
  );
}