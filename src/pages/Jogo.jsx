
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Jogo.css";

const emojis = [
  "🍓", "🍉", "🍍", "🍒", "🍇", "🍌",
  "🍎", "🍊", "🥝", "🥥", "🫐", "🍑"
];

const quantidadePares = {
  facil: 6,
  medio: 8,
  dificil: 12,
};

// Embaralha as cartas
function embaralharCartas(dificuldade) {
  const quantidade = quantidadePares[dificuldade] || 8;

  const selecionados = emojis.slice(0, quantidade);

  return [...selecionados, ...selecionados]
    .map((emoji, index) => ({
      id: index,
      emoji,
      encontrada: false,
    }))
    .sort(() => Math.random() - 0.5);
}

function Jogo() {
  const location = useLocation();
  const navigate = useNavigate();

  const dificuldade = location.state?.dificuldade || "medio";
  const modo = location.state?.modo || "um-jogador";

  const quantidade = quantidadePares[dificuldade] || 8;

  const [cartas, setCartas] = useState(() =>
    embaralharCartas(dificuldade)
  );

  const [selecionadas, setSelecionadas] = useState([]);
  const [jogadas, setJogadas] = useState(0);
  const [paresEncontrados, setParesEncontrados] = useState(0);
  const [tempo, setTempo] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  const bloqueioRef = useRef(false);
  const resultadoEnviadoRef = useRef(false);

  // Conta o tempo da partida
  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempo((anterior) => anterior + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, []);

  // Verifica se o jogador encontrou todos os pares
  useEffect(() => {
    if (
      paresEncontrados === quantidade &&
      !resultadoEnviadoRef.current
    ) {
      resultadoEnviadoRef.current = true;

      const pontuacao = Math.max(
        0,
        quantidade * 100 - jogadas * 10
      );

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
    }
  }, [
    paresEncontrados,
    quantidade,
    jogadas,
    tempo,
    dificuldade,
    modo,
    navigate,
  ]);

  // Formata o tempo
  function formatarTempo() {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    return `${String(minutos).padStart(2, "0")}:${String(
      segundos
    ).padStart(2, "0")}`;
  }

  // Reinicia a partida
  function reiniciarJogo() {
    bloqueioRef.current = false;
    resultadoEnviadoRef.current = false;

    setCartas(embaralharCartas(dificuldade));
    setSelecionadas([]);
    setJogadas(0);
    setParesEncontrados(0);
    setTempo(0);
    setBloqueado(false);
  }

  // Seleciona uma carta
  function selecionarCarta(carta) {
    if (
      bloqueioRef.current ||
      carta.encontrada ||
      selecionadas.includes(carta.id)
    ) {
      return;
    }

    const novasSelecionadas = [...selecionadas, carta.id];

    setSelecionadas(novasSelecionadas);

    // Quando duas cartas são selecionadas
    if (novasSelecionadas.length === 2) {
      setJogadas((anterior) => anterior + 1);

      const primeira = cartas.find(
        (item) => item.id === novasSelecionadas[0]
      );

      const segunda = cartas.find(
        (item) => item.id === novasSelecionadas[1]
      );

      if (primeira.emoji === segunda.emoji) {
        // As cartas são iguais
        setCartas((anterior) =>
          anterior.map((item) =>
            item.id === primeira.id || item.id === segunda.id
              ? { ...item, encontrada: true }
              : item
          )
        );

        setParesEncontrados((anterior) => anterior + 1);
        setSelecionadas([]);
      } else {
        // As cartas são diferentes
        bloqueioRef.current = true;
        setBloqueado(true);

        setTimeout(() => {
          setSelecionadas([]);
          bloqueioRef.current = false;
          setBloqueado(false);
        }, 1000);
      }
    }
  }

  return (
    <main className="jogo-container">
      <section className="jogo-card">
        <h1>Jogo da Memória</h1>

        <p className="jogo-subtitulo">
          Encontre todos os pares de cartas iguais!
        </p>

        <div className="jogo-informacoes">
          <div>
            <span>⏱️ Tempo</span>
            <strong>{formatarTempo()}</strong>
          </div>

          <div>
            <span>🎯 Jogadas</span>
            <strong>{jogadas}</strong>
          </div>

          <div>
            <span>🏆 Pares</span>
            <strong>
              {paresEncontrados}/{quantidade}
            </strong>
          </div>
        </div>

        <div className={`cartas-grid cartas-${dificuldade}`}>
          {cartas.map((carta) => {
            const virada =
              selecionadas.includes(carta.id) ||
              carta.encontrada;

            return (
              <button
                key={carta.id}
                className={`carta ${
                  virada ? "carta-virada" : ""
                } ${
                  carta.encontrada ? "carta-encontrada" : ""
                }`}
                onClick={() => selecionarCarta(carta)}
                disabled={carta.encontrada || bloqueado}
                aria-label={
                  virada
                    ? `Carta ${carta.emoji}`
                    : "Carta fechada"
                }
              >
                {virada ? carta.emoji : "?"}
              </button>
            );
          })}
        </div>

        <div className="jogo-botoes">
          <button
            className="botao-secundario"
            onClick={() => navigate("/modo-jogo")}
          >
            Voltar ao menu
          </button>

          <button
            className="botao-principal"
            onClick={reiniciarJogo}
          >
            Reiniciar partida
          </button>
        </div>
      </section>
    </main>
  );
}

export default Jogo;
