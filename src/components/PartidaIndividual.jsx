
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, RotateCcw, Home } from "lucide-react";
import { useJogoMemoria } from "../hooks/useJogoMemoria";
import Tabuleiro from "./Tabuleiro";
import EstatisticasPartida from "./EstatisticasPartida";

function PartidaIndividual({ dificuldade, modo }) {
  const navigate = useNavigate();
  const resultadoEnviadoRef = useRef(false);

  const jogo = useJogoMemoria(dificuldade);
  const { finalizada, quantidade, jogadas, tempo } = jogo;

  useEffect(() => {
    if (!finalizada || resultadoEnviadoRef.current) return;

    resultadoEnviadoRef.current = true;

    const pontuacao = Math.max(0, quantidade * 100 - jogadas * 10);

    navigate("/resultado", {
      replace: true,
      state: {
        pontuacao,
        jogadas,
        tempo,
        dificuldade,
        modo,
      },
    });
  }, [
    finalizada,
    quantidade,
    jogadas,
    tempo,
    dificuldade,
    modo,
    navigate,
  ]);

  function reiniciarJogo() {
    resultadoEnviadoRef.current = false;
    jogo.reiniciar();
  }

  return (
    <main className="pagina jogo">
      <div className="jogo-decoracao" aria-hidden="true">
        <span className="jogo-estrela jogo-estrela-1">✦</span>
        <span className="jogo-estrela jogo-estrela-2">✧</span>
        <span className="jogo-estrela jogo-estrela-3">✦</span>
        <span className="jogo-estrela jogo-estrela-4">✧</span>
      </div>

      <header className="jogo-cabecalho">
        <div className="jogo-selo">
          <Sparkles size={15} aria-hidden="true" />
          <span>Desafie sua memória</span>
        </div>

        <h1>
          Encontre os <span>pares!</span>
        </h1>

        <p>
          Vire duas cartas por vez e memorize onde cada figura está.
          Concentre-se e complete sua coleção!
        </p>
      </header>

      <EstatisticasPartida
        tempo={tempo}
        jogadas={jogadas}
        pares={jogo.paresEncontrados}
        quantidade={quantidade}
      />

      <section className="jogo-area-tabuleiro">
        <Tabuleiro
          cartas={jogo.cartas}
          selecionadas={jogo.selecionadas}
          bloqueado={jogo.bloqueado}
          dificuldade={dificuldade}
          aoEscolher={jogo.selecionarCarta}
        />
      </section>

      <div className="jogo-botoes">
        <button
          type="button"
          className="btn btn-contorno jogo-botao-voltar"
          onClick={() => navigate("/modo-jogo")}
        >
          <Home size={18} aria-hidden="true" />
          <span>Voltar ao menu</span>
        </button>

        <button
          type="button"
          className="btn btn-principal jogo-botao-reiniciar"
          onClick={reiniciarJogo}
        >
          <RotateCcw size={18} aria-hidden="true" />
          <span>Reiniciar partida</span>
        </button>
      </div>
    </main>
  );
}

export default PartidaIndividual;
