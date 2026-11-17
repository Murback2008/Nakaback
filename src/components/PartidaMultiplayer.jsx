
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, RotateCcw, Home, Crown } from "lucide-react";
import { useJogoMemoria } from "../hooks/useJogoMemoria";
import Tabuleiro from "./Tabuleiro";
import EstatisticasPartida from "./EstatisticasPartida";

const ATRASO_FIM_MS = 900;

// Modo dois jogadores no mesmo aparelho, com turnos e placar
function PartidaMultiplayer({ dificuldade, jogadores }) {
  const navigate = useNavigate();

  const [vez, setVez] = useState(0);
  const [pontos, setPontos] = useState([0, 0]);
  const [donos, setDonos] = useState({});

  const vezRef = useRef(0);

  const jogo = useJogoMemoria(dificuldade, {
    aoAcertar: (ids) => {
      const quem = vezRef.current;

      setPontos((atuais) =>
        atuais.map((p, i) => (i === quem ? p + 1 : p))
      );

      setDonos((atuais) => ({
        ...atuais,
        [ids[0]]: quem,
        [ids[1]]: quem,
      }));
    },

    aoErrar: () => {
      vezRef.current = vezRef.current === 0 ? 1 : 0;
      setVez(vezRef.current);
    },
  });

  const { finalizada, quantidade, jogadas, tempo } = jogo;

  useEffect(() => {
    if (!finalizada) return undefined;

    const espera = setTimeout(() => {
      navigate("/resultado-multiplayer", {
        replace: true,
        state: {
          jogadores,
          pontos,
          dificuldade,
          jogadas,
          tempo,
          quantidade,
        },
      });
    }, ATRASO_FIM_MS);

    return () => clearTimeout(espera);
  }, [
    finalizada,
    jogadores,
    pontos,
    dificuldade,
    jogadas,
    tempo,
    quantidade,
    navigate,
  ]);

  function reiniciarPartida() {
    vezRef.current = 0;
    setVez(0);
    setPontos([0, 0]);
    setDonos({});
    jogo.reiniciar();
  }

  const atual = jogadores[vez];

  const cores = Object.fromEntries(
    Object.entries(donos).map(([id, quem]) => [
      id,
      jogadores[quem].cor,
    ])
  );

  let aviso = `Vez de ${atual.nome}`;

  if (jogo.bloqueado) {
    aviso = `Não foi dessa vez, ${atual.nome}`;
  }

  if (finalizada) {
    aviso = "Todos os pares encontrados!";
  }

  return (
    <main
      className="pagina jogo jogo-multiplayer"
      style={{ "--cor-vez": atual.cor }}
    >
      <div className="jogo-decoracao" aria-hidden="true">
        <span className="jogo-estrela jogo-estrela-1">✦</span>
        <span className="jogo-estrela jogo-estrela-2">✧</span>
        <span className="jogo-estrela jogo-estrela-3">✦</span>
        <span className="jogo-estrela jogo-estrela-4">✧</span>
      </div>

      <header className="jogo-cabecalho">
        <div className="jogo-selo">
          <Sparkles size={15} aria-hidden="true" />
          <span>Desafio em dupla</span>
        </div>

        <h1>
          Duelo de <span>memória!</span>
        </h1>

        <p>
          Encontre os pares, conquiste pontos e descubra quem tem a melhor memória!
        </p>
      </header>

      <section className="placar" role="group" aria-label="Placar dos jogadores">
        {jogadores.map((jogador, indice) => {
          const ativo = indice === vez && !finalizada;

          return (
            <div
              key={indice}
              className={`placar-jogador ${ativo ? "ativo" : ""}`}
              style={{ "--cor-jogador": jogador.cor }}
              aria-current={ativo ? "true" : undefined}
            >
              <span className="placar-ficha" aria-hidden="true">
                {jogador.nome.charAt(0).toUpperCase()}
              </span>

              <span className="placar-dados">
                <strong>{jogador.nome}</strong>

                <small>
                  {pontos[indice]}{" "}
                  {pontos[indice] === 1 ? "par encontrado" : "pares encontrados"}
                </small>
              </span>

              {ativo && (
                <span className="placar-vez" aria-label="Jogador da vez">
                  <Crown size={18} />
                </span>
              )}
            </div>
          );
        })}
      </section>

      <p
        className="aviso-vez"
        key={`${vez}-${jogo.bloqueado}-${finalizada}`}
        aria-live="polite"
      >
        <span className="aviso-vez-ponto" aria-hidden="true" />
        {aviso}
      </p>

      <div className="tabuleiro-moldura">
        <Tabuleiro
          cartas={jogo.cartas}
          selecionadas={jogo.selecionadas}
          bloqueado={jogo.bloqueado}
          dificuldade={dificuldade}
          cores={cores}
          aoEscolher={jogo.selecionarCarta}
        />
      </div>

      <EstatisticasPartida
        tempo={tempo}
        jogadas={jogadas}
        pares={jogo.paresEncontrados}
        quantidade={quantidade}
      />

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
          onClick={reiniciarPartida}
        >
          <RotateCcw size={18} aria-hidden="true" />
          <span>Reiniciar partida</span>
        </button>
      </div>
    </main>
  );
}

export default PartidaMultiplayer;
