import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  // A ref mantém a vez sempre atual dentro dos callbacks do hook
  const vezRef = useRef(0);

  const jogo = useJogoMemoria(dificuldade, {
    aoAcertar: (ids) => {
      const quem = vezRef.current;

      // Acertou: ponto para quem jogou, que continua na vez
      setPontos((atuais) => atuais.map((p, i) => (i === quem ? p + 1 : p)));
      setDonos((atuais) => ({ ...atuais, [ids[0]]: quem, [ids[1]]: quem }));
    },
    aoErrar: () => {
      // Só é chamado depois que as cartas voltaram a ficar escondidas
      vezRef.current = vezRef.current === 0 ? 1 : 0;
      setVez(vezRef.current);
    },
  });

  const { finalizada, quantidade, jogadas, tempo } = jogo;

  // Ao encontrar o último par, mostra um instante o tabuleiro e abre o resultado
  useEffect(() => {
    if (!finalizada) return undefined;

    const espera = setTimeout(() => {
      navigate("/resultado-multiplayer", {
        replace: true,
        state: { jogadores, pontos, dificuldade, jogadas, tempo, quantidade },
      });
    }, ATRASO_FIM_MS);

    return () => clearTimeout(espera);
  }, [finalizada, jogadores, pontos, dificuldade, jogadas, tempo, quantidade, navigate]);

  function reiniciarPartida() {
    vezRef.current = 0;
    setVez(0);
    setPontos([0, 0]);
    setDonos({});
    jogo.reiniciar();
  }

  const atual = jogadores[vez];
  const cores = Object.fromEntries(
    Object.entries(donos).map(([id, quem]) => [id, jogadores[quem].cor])
  );

  let aviso = `Vez de ${atual.nome}`;
  if (jogo.bloqueado) aviso = `Não foi dessa vez, ${atual.nome}`;
  if (finalizada) aviso = "Todos os pares encontrados!";

  return (
    <main className="pagina jogo" style={{ "--cor-vez": atual.cor }}>
      <div className="placar" role="group" aria-label="Placar">
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
                  {pontos[indice]} {pontos[indice] === 1 ? "par" : "pares"}
                </small>
              </span>
            </div>
          );
        })}
      </div>

      <p className="aviso-vez" key={`${vez}-${jogo.bloqueado}`} aria-live="polite">
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
        <button type="button" className="btn btn-contorno" onClick={() => navigate("/modo-jogo")}>
          Voltar ao menu
        </button>
        <button type="button" className="btn btn-principal" onClick={reiniciarPartida}>
          Reiniciar partida
        </button>
      </div>
    </main>
  );
}

export default PartidaMultiplayer;
