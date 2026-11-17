
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Trophy,
  Sparkles,
  RotateCcw,
  Home,
  Crown,
  Medal,
} from "lucide-react";
import { formatarTempo, nomesDificuldade } from "../data/cartas";
import "../styles/ResultadoMultiplayer.css";

function ResultadoMultiplayer() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    jogadores,
    pontos,
    dificuldade,
    jogadas,
    tempo,
  } = location.state || {};

  // Sem dados de uma partida (ex.: acesso direto), volta para a escolha do modo
  if (
    !jogadores ||
    jogadores.length !== 2 ||
    !pontos ||
    pontos.length !== 2
  ) {
    return <Navigate to="/modo-jogo" replace />;
  }

  const empate = pontos[0] === pontos[1];
  const indiceVencedor = pontos[0] > pontos[1] ? 0 : 1;
  const vencedor = jogadores[indiceVencedor];

  function jogarNovamente() {
    navigate("/jogo", {
      state: {
        modo: "dois-jogadores",
        dificuldade,
        jogadores,
      },
    });
  }

  function voltarMenu() {
    navigate("/modo-jogo");
  }

  return (
    <main
      className="pagina pagina-estreita resultado-multiplayer"
      style={
        empate
          ? undefined
          : { "--cor-vencedor": vencedor.cor }
      }
    >
      <div className="mp-decoracao" aria-hidden="true">
        <span className="mp-estrela mp-estrela-1">✦</span>
        <span className="mp-estrela mp-estrela-2">✧</span>
        <span className="mp-estrela mp-estrela-3">✦</span>
        <span className="mp-estrela mp-estrela-4">✧</span>
      </div>

      <header className="mp-topo">
        <div className="mp-selo">
          <Sparkles size={15} aria-hidden="true" />
          <span>Desafio finalizado</span>
        </div>

        <div className={`mp-trofeu ${empate ? "mp-trofeu-empate" : ""}`}>
          {empate ? (
            <Medal size={43} strokeWidth={1.7} />
          ) : (
            <Trophy size={43} strokeWidth={1.7} />
          )}

          <span className="mp-trofeu-brilho">
            <Sparkles size={16} />
          </span>
        </div>

        <h1>
          {empate ? (
            <>Empate!</>
          ) : (
            <>
              <span className="mp-vencedor-nome">
                {vencedor.nome}
              </span>
              {" venceu!"}
            </>
          )}
        </h1>

        <p>
          {empate
            ? "Que disputa incrível! Os dois encontraram o mesmo número de pares."
            : "Todos os pares foram encontrados. Temos um campeão da memória!"}
        </p>
      </header>

      <section className="mp-placar-container">
        <div className="mp-placar-titulo">
          <Trophy size={19} aria-hidden="true" />
          <h2>Placar da partida</h2>
        </div>

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
                  <strong>{jogador.nome}</strong>

                  {destaque && (
                    <small className="mp-etiqueta-vencedor">
                      <Crown size={13} aria-hidden="true" />
                      Vencedor
                    </small>
                  )}

                  {empate && (
                    <small className="mp-etiqueta-empate">
                      <Sparkles size={12} aria-hidden="true" />
                      Empate
                    </small>
                  )}
                </span>

                <span className="mp-pontos">
                  <strong>{pontos[indice]}</strong>
                  <small>
                    {pontos[indice] === 1 ? "par" : "pares"}
                  </small>
                </span>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="mp-resumo">
        <div className="mp-resumo-item">
          <span className="mp-resumo-icone">
            <Medal size={19} aria-hidden="true" />
          </span>
          <span className="mp-resumo-legenda">Dificuldade</span>
          <strong>
            {nomesDificuldade[dificuldade] || "Médio"}
          </strong>
        </div>

        <div className="mp-resumo-item">
          <span className="mp-resumo-icone">
            <RotateCcw size={19} aria-hidden="true" />
          </span>
          <span className="mp-resumo-legenda">Jogadas</span>
          <strong>{jogadas}</strong>
        </div>

        <div className="mp-resumo-item">
          <span className="mp-resumo-icone">
            <Sparkles size={19} aria-hidden="true" />
          </span>
          <span className="mp-resumo-legenda">Tempo</span>
          <strong>{formatarTempo(tempo || 0)}</strong>
        </div>
      </section>

      <div className="mp-mensagem-final">
        <Sparkles size={17} aria-hidden="true" />
        <p>
          {empate
            ? "A melhor parte foi jogar juntos. Que tal mais uma rodada?"
            : `Parabéns, ${vencedor.nome}! Que tal defender seu título?`}
        </p>
        <Sparkles size={17} aria-hidden="true" />
      </div>

      <div className="resultado-botoes mp-botoes">
        <button
          type="button"
          className="btn btn-principal"
          onClick={jogarNovamente}
        >
          <RotateCcw size={18} aria-hidden="true" />
          Jogar novamente
        </button>

        <button
          type="button"
          className="btn btn-contorno"
          onClick={voltarMenu}
        >
          <Home size={18} aria-hidden="true" />
          Voltar aos modos
        </button>
      </div>

      <p className="mp-rodape">
        <Sparkles size={13} aria-hidden="true" />
        Nakaback · A diversão está na memória!
      </p>
    </main>
  );
}

export default ResultadoMultiplayer;
