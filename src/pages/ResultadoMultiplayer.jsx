import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Trophy } from "lucide-react";
import { formatarTempo, nomesDificuldade } from "../data/cartas";
import "../styles/ResultadoMultiplayer.css";

function ResultadoMultiplayer() {
  const navigate = useNavigate();
  const location = useLocation();

  const { jogadores, pontos, dificuldade, jogadas, tempo } = location.state || {};

  // Sem dados de uma partida (ex.: acesso direto), volta para a escolha do modo
  if (!jogadores || !pontos) {
    return <Navigate to="/modo-jogo" replace />;
  }

  const empate = pontos[0] === pontos[1];
  const indiceVencedor = pontos[0] > pontos[1] ? 0 : 1;
  const vencedor = jogadores[indiceVencedor];

  function jogarNovamente() {
    navigate("/jogo", {
      state: { modo: "dois-jogadores", dificuldade, jogadores },
    });
  }

  return (
    <main
      className="pagina pagina-estreita"
      style={empate ? undefined : { "--cor-vencedor": vencedor.cor }}
    >
      <header className="pagina-cabecalho">
        <h1>{empate ? "Empate!" : `${vencedor.nome} venceu!`}</h1>
        <p>
          {empate
            ? "Os dois encontraram o mesmo número de pares."
            : "Todos os pares foram encontrados. Quer a revanche?"}
        </p>
      </header>

      <ol className="mp-placar">
        {jogadores.map((jogador, indice) => {
          const destaque = !empate && indice === indiceVencedor;

          return (
            <li
              key={indice}
              className={`mp-jogador ${destaque ? "vencedor" : ""}`}
              style={{ "--cor-jogador": jogador.cor }}
            >
              <span className="mp-ficha" aria-hidden="true">
                {jogador.nome.charAt(0).toUpperCase()}
              </span>
              <span className="mp-nome">
                {jogador.nome}
                {destaque && (
                  <Trophy size={18} aria-label="Vencedor" className="mp-trofeu" />
                )}
              </span>
              <span className="mp-pontos">
                <strong>{pontos[indice]}</strong>
                <small>{pontos[indice] === 1 ? "par" : "pares"}</small>
              </span>
            </li>
          );
        })}
      </ol>

      <p className="mp-detalhes">
        Dificuldade {nomesDificuldade[dificuldade] || "Médio"}, {jogadas} jogadas em{" "}
        {formatarTempo(tempo || 0)}.
      </p>

      <div className="resultado-botoes">
        <button type="button" className="btn btn-principal" onClick={jogarNovamente}>
          Jogar novamente
        </button>
        <button type="button" className="btn btn-contorno" onClick={() => navigate("/modo-jogo")}>
          Voltar aos modos
        </button>
      </div>
    </main>
  );
}

export default ResultadoMultiplayer;
