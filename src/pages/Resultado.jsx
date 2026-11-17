
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import { Clock, Medal, Star, Target } from "lucide-react";
import { formatarTempo, nomesDificuldade } from "../data/cartas";
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
    <main className="pagina pagina-estreita resultado">
      <header className="resultado-topo">
        <h1>Parabéns!</h1>
        <p>Você completou o jogo da memória.</p>
      </header>

      <div className="resultado-pontuacao">
        <strong>{pontuacao}</strong>
        <span>pontos</span>
      </div>

      <dl className="resultado-informacoes">
        <div>
          <dt><Target size={16} aria-hidden="true" /> Jogadas</dt>
          <dd>{jogadas}</dd>
        </div>
        <div>
          <dt><Clock size={16} aria-hidden="true" /> Tempo</dt>
          <dd>{formatarTempo(tempo)}</dd>
        </div>
        <div>
          <dt><Star size={16} aria-hidden="true" /> Dificuldade</dt>
          <dd>{nomesDificuldade[dificuldade] || "Médio"}</dd>
        </div>
      </dl>

      {mensagem && <p className="resultado-mensagem">{mensagem}</p>}

      <section className="ranking-container">
        <h2>
          <Medal size={22} aria-hidden="true" /> Ranking dos jogadores
        </h2>

        {carregandoRanking ? (
          <p>Carregando ranking...</p>
        ) : ranking.length === 0 ? (
          <p>Ainda não existem pontuações no ranking.</p>
        ) : (
          <ol className="ranking-lista">
            {ranking.map((jogador, index) => (
              <li
                className={`ranking-linha ${usuario?.id === jogador.user_id ? "ranking-voce" : ""}`}
                key={jogador.user_id}
              >
                <span className="ranking-posicao">{index + 1}º</span>
                <span className="ranking-nome">{jogador.nome_jogador}</span>
                <strong className="ranking-pontos">{jogador.pontuacao}</strong>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="resultado-botoes">
        <button type="button" className="btn btn-principal" onClick={jogarNovamente}>
          Jogar novamente
        </button>
        <button type="button" className="btn btn-contorno" onClick={voltarMenu}>
          Voltar ao menu
        </button>
      </div>
    </main>
  );
}

export default Resultado;
