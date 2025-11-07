import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../style/Loja.css";

export default function Loja() {
  const [cosmeticos, setCosmeticos] = useState([]);
  const [filtro, setFiltro] = useState({
    nome: "",
    tipo: "",
    raridade: "",
    dataInicio: "",
    dataFim: "",
    novos: false,
    loja: false,
    promocao: false,
  });

  const navigate = useNavigate();

  // Carrega cosméticos
  useEffect(() => {
    async function carregarCosmeticos() {
      try {
        const resposta = await api.get("/cosmeticos");
        setCosmeticos(resposta.data);
      } catch (erro) {
        console.error("Erro ao carregar cosméticos:", erro);
      }
    }
    carregarCosmeticos();
  }, []);

  // Filtragem local
  const cosmeticosFiltrados = cosmeticos.filter((item) => {
    const nomeMatch = item.nome.toLowerCase().includes(filtro.nome.toLowerCase());
    const tipoMatch = filtro.tipo ? item.tipo === filtro.tipo : true;
    const raridadeMatch = filtro.raridade ? item.raridade === filtro.raridade : true;

    const dataItem = new Date(item.createdAt);
    const inicioMatch = filtro.dataInicio ? dataItem >= new Date(filtro.dataInicio) : true;
    const fimMatch = filtro.dataFim ? dataItem <= new Date(filtro.dataFim) : true;

    const novosMatch = filtro.novos ? item.status === "novo" : true;
    const lojaMatch = filtro.loja ? item.status === "loja" : true;
    const promocaoMatch = filtro.promocao ? item.status === "promocao" : true;

    return (
      nomeMatch &&
      tipoMatch &&
      raridadeMatch &&
      inicioMatch &&
      fimMatch &&
      novosMatch &&
      lojaMatch &&
      promocaoMatch
    );
  });

  return (
    <div className="loja-container">
      <h1>🛍️ Loja de Cosméticos</h1>

      {/* 🔹 Filtros */}
      <div className="filtros-container">
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={filtro.nome}
          onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
        />

        <select
          value={filtro.tipo}
          onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        >
          <option value="">Tipo</option>
          <option value="outfit">Outfit</option>
          <option value="backpack">Backpack</option>
          <option value="pickaxe">Pickaxe</option>
          <option value="emote">Emote</option>
        </select>

        <select
          value={filtro.raridade}
          onChange={(e) => setFiltro({ ...filtro, raridade: e.target.value })}
        >
          <option value="">Raridade</option>
          <option value="common">Comum</option>
          <option value="rare">Raro</option>
          <option value="epic">Épico</option>
          <option value="legendary">Lendário</option>
        </select>

        <div className="data-filtro">
          <label>De:</label>
          <input
            type="date"
            value={filtro.dataInicio}
            onChange={(e) => setFiltro({ ...filtro, dataInicio: e.target.value })}
          />
          <label>Até:</label>
          <input
            type="date"
            value={filtro.dataFim}
            onChange={(e) => setFiltro({ ...filtro, dataFim: e.target.value })}
          />
        </div>

        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={filtro.novos}
              onChange={() => setFiltro({ ...filtro, novos: !filtro.novos })}
            />
            Novos
          </label>

          <label>
            <input
              type="checkbox"
              checked={filtro.loja}
              onChange={() => setFiltro({ ...filtro, loja: !filtro.loja })}
            />
            À venda
          </label>

          <label>
            <input
              type="checkbox"
              checked={filtro.promocao}
              onChange={() => setFiltro({ ...filtro, promocao: !filtro.promocao })}
            />
            Promoção
          </label>
        </div>
      </div>

      {/* 🔹 Listagem */}
      <div className="grid-cosmeticos">
        {cosmeticosFiltrados.map((item) => (
          <div key={item._id} className="card-cosmetico">
            <img src={item.imagem} alt={item.nome} />
            <h3>{item.nome}</h3>
            <p>{item.tipo}</p>
            <p className={`raridade ${item.raridade}`}>{item.raridade}</p>
            <p className="preco">{item.preco} V-Bucks</p>

            <button
              className="btn-detalhes"
              onClick={() => navigate(`/cosmetico/${item._id}`)}
            >
              Ver Detalhes
            </button>
          </div>
        ))}

        {cosmeticosFiltrados.length === 0 && (
          <p className="sem-resultados">Nenhum cosmético encontrado 😢</p>
        )}
      </div>
    </div>
  );
}
