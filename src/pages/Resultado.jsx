
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import "../styles/Resultado.css";

function Resultado() {
  const navigate = useNavigate();
  const location = useLocation();

  const { usuario, carregando } = useAuth();

  const {
    pontuacao = 0,
    jogadas = 0,
    tempo = 0,
    dificuldade = "medio",
    modo = "um-jogador",
  } = location.state || {};

  const [ranking, setRanking] = useState([]);
  const [carregandoRanking, setCarregandoRanking] = useState(true);
  const [mensagem, setMensagem] = useState("");

  const processamentoRef = useRef(false);

  const nomesDificuldade = {
    facil: "Fácil",
    medio: "Médio",
    dificil: "Difícil",
  };

  function formatarTempo() {
    const minutos = Math.floor(tempo / 60);
    const segundos = tempo % 60;

    return `${String(minutos).padStart(2, "0")}:${String(
      segundos
    ).padStart(2, "0")}`;
  }

  function jogarNovamente() {
    navigate("/jogo", {
      state: {
        dificuldade,
        modo,
      },
    });
  }

  function voltarMenu() {
    navigate("/modo-jogo");
  }

  async function carregarRanking() {
    const { data, error } = await supabase
      .from("pontuacoes")
      .select("user_id, nome_jogador, pontuacao, dificuldade")
      .order("pontuacao", { ascending: false });

    if (error) {
      console.error("Erro ao carregar ranking:", error.message);
      setMensagem("Não foi possível carregar o ranking.");
      return;
    }

    // Guarda somente a melhor pontuação de cada jogador.
    const melhoresPontuacoes = {};

    data.forEach((registro) => {
      const jogador = melhoresPontuacoes[registro.user_id];

      if (
        !jogador ||
        registro.pontuacao > jogador.pontuacao
      ) {
        melhoresPontuacoes[registro.user_id] = registro;
      }
    });

    const lista = Object.values(melhoresPontuacoes)
      .sort((a, b) => b.pontuacao - a.pontuacao);

    setRanking(lista);
  }

  useEffect(() => {
    if (carregando || processamentoRef.current) {
      return;
    }

    processamentoRef.current = true;

    async function finalizarResultado() {
      // Salva a pontuação somente se o jogador estiver conectado.
      if (usuario) {
        const nome =
          usuario.user_metadata?.nome ||
          usuario.email?.split("@")[0] ||
          "Jogador";

        const { error } = await supabase
          .from("pontuacoes")
          .insert({
            user_id: usuario.id,
            nome_jogador: nome,
            pontuacao,
            dificuldade,
          });

        if (error) {
          console.error("Erro ao salvar pontuação:", error.message);
          setMensagem("Não foi possível salvar sua pontuação.");
        } else {
          setMensagem("Sua pontuação foi salva no ranking!");
        }
      } else {
        setMensagem(
          "Entre na sua conta para salvar sua pontuação no ranking."
        );
      }

      await carregarRanking();
      setCarregandoRanking(false);
    }

    finalizarResultado();
  }, [usuario, carregando, pontuacao, dificuldade]);

  return (
    <main className="resultado-container">
      <section className="resultado-card">
        <div className="resultado-trofeu">🏆</div>

        <h1>Parabéns!</h1>

        <p className="resultado-subtitulo">
          Você completou o jogo da memória!
        </p>

        <div className="resultado-pontuacao">
          <span>Sua pontuação</span>
          <strong>{pontuacao}</strong>
          <small>pontos</small>
        </div>

        <div className="resultado-informacoes">
          <div className="resultado-item">
            <span>🎯</span>
            <p>Jogadas</p>
            <strong>{jogadas}</strong>
          </div>

          <div className="resultado-item">
            <span>⏱️</span>
            <p>Tempo</p>
            <strong>{formatarTempo()}</strong>
          </div>

          <div className="resultado-item">
            <span>⭐</span>
            <p>Dificuldade</p>
            <strong>
              {nomesDificuldade[dificuldade] || "Médio"}
            </strong>
          </div>
        </div>

        {mensagem && (
          <p className="resultado-mensagem">{mensagem}</p>
        )}

        <div className="ranking-container">
          <h2>🏅 Ranking dos jogadores</h2>

          {carregandoRanking ? (
            <p>Carregando ranking...</p>
          ) : ranking.length === 0 ? (
            <p>Ainda não existem pontuações no ranking.</p>
          ) : (
            <div className="ranking-tabela">
              <div className="ranking-linha ranking-cabecalho">
                <span>Posição</span>
                <span>Jogador</span>
                <span>Pontos</span>
              </div>

              {ranking.map((jogador, index) => (
                <div
                  className="ranking-linha"
                  key={jogador.user_id}
                >
                  <span className="ranking-posicao">
                    {index + 1}º
                  </span>

                  <span className="ranking-nome">
                    {jogador.nome_jogador}
                  </span>

                  <strong className="ranking-pontos">
                    {jogador.pontuacao}
                  </strong>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="resultado-botoes">
          <button
            className="resultado-botao principal"
            onClick={jogarNovamente}
          >
            Jogar novamente
          </button>

          <button
            className="resultado-botao secundario"
            onClick={voltarMenu}
          >
            Voltar ao menu
          </button>
        </div>
      </section>
    </main>
  );
}

export default Resultado;
