import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useJogoMemoria } from "../hooks/useJogoMemoria";
import Tabuleiro from "./Tabuleiro";
import EstatisticasPartida from "./EstatisticasPartida";

// Modo um jogador: mesmas regras e pontuação de antes
function PartidaIndividual({ dificuldade, modo }) {
  const navigate = useNavigate();
  const resultadoEnviadoRef = useRef(false);

  const jogo = useJogoMemoria(dificuldade);
  const { finalizada, quantidade, jogadas, tempo } = jogo;

  // Verifica se o jogador encontrou todos os pares
  useEffect(() => {
    if (!finalizada || resultadoEnviadoRef.current) return;

    resultadoEnviadoRef.current = true;

    const pontuacao = Math.max(0, quantidade * 100 - jogadas * 10);

    navigate("/resultado", {
      replace: true,
      state: { pontuacao, jogadas, tempo, dificuldade, modo },
    });
  }, [finalizada, quantidade, jogadas, tempo, dificuldade, modo, navigate]);

  function reiniciarJogo() {
    resultadoEnviadoRef.current = false;
    jogo.reiniciar();
  }

  return (
    <main className="pagina jogo">
      <header className="jogo-cabecalho">
        <h1>Encontre os pares</h1>
        <p>Vire duas cartas por vez e memorize onde cada figura está.</p>
      </header>

      <EstatisticasPartida
        tempo={tempo}
        jogadas={jogadas}
        pares={jogo.paresEncontrados}
        quantidade={quantidade}
      />

      <Tabuleiro
        cartas={jogo.cartas}
        selecionadas={jogo.selecionadas}
        bloqueado={jogo.bloqueado}
        dificuldade={dificuldade}
        aoEscolher={jogo.selecionarCarta}
      />

      <div className="jogo-botoes">
        <button type="button" className="btn btn-contorno" onClick={() => navigate("/modo-jogo")}>
          Voltar ao menu
        </button>
        <button type="button" className="btn btn-principal" onClick={reiniciarJogo}>
          Reiniciar partida
        </button>
      </div>
    </main>
  );
}

export default PartidaIndividual;
