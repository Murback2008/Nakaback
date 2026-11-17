
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../context/AuthContext";
import {
  Clock,
  Medal,
  Star,
  Target,
  Sparkles,
  Trophy,
  RotateCcw,
  Home,
} from "lucide-react";
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
      <div className="resultado-decoracao" aria-hidden="true">
        <span className="resultado-estrela resultado-estrela-1">✦</span>
        <span className="resultado-estrela resultado-estrela-2">✧</span>
        <span className="resultado-estrela resultado-estrela-3">✦</span>
        <span className="resultado-estrela resultado-estrela-4">✧</span>
      </div>

      <header className="resultado-topo">
        <div className="resultado-selo">
          <Sparkles size={16} aria-hidden="true" />
          <span>Missão concluída</span>
        </div>

        <div className="resultado-trofeu" aria-hidden="true">
          <Trophy size={42} strokeWidth={1.7} />
          <span className="resultado-trofeu-brilho">
            <Sparkles size={17} />
          </span>
        </div>

        <h1>Parabéns!</h1>

        <p>Você completou o jogo da memória!</p>
      </header>

      <section className="resultado-pontuacao">
        <span className="resultado-pontuacao-legenda">
          Sua pontuação
        </span>

        <strong>{pontuacao}</strong>

        <span className="resultado-pontuacao-unidade">
          pontos
        </span>

        <div className="resultado-pontuacao-detalhe">
          <Star size={14} fill="currentColor" />
          <span>Continue superando seus recordes!</span>
          <Star size={14} fill="currentColor" />
        </div>
      </section>

      <dl className="resultado-informacoes">
        <div className="resultado-info-item">
          <span className="resultado-info-icone">
            <Target size={20} aria-hidden="true" />
          </span>

          <dt>Jogadas</dt>
          <dd>{jogadas}</dd>
        </div>

        <div className="resultado-info-item">
          <span className="resultado-info-icone">
            <Clock size={20} aria-hidden="true" />
          </span>

          <dt>Tempo</dt>
          <dd>{formatarTempo(tempo)}</dd>
        </div>

        <div className="resultado-info-item">
          <span className="resultado-info-icone">
            <Star size={20} aria-hidden="true" />
          </span>

          <dt>Dificuldade</dt>
          <dd>{nomesDificuldade[dificuldade] || "Médio"}</dd>
        </div>
      </dl>

      {mensagem && (
        <p className="resultado-mensagem" role="status">
          {mensagem}
        </p>
      )}

      <section className="ranking-container">
        <div className="ranking-cabecalho">
          <span className="ranking-icone">
            <Medal size={23} aria-hidden="true" />
          </span>

          <div>
            <h2>Ranking dos jogadores</h2>
            <p>Os melhores resultados do Nakaback</p>
          </div>
        </div>

        {carregandoRanking ? (
          <div className="ranking-estado">
            <span className="ranking-carregando" />
            <p>Carregando ranking...</p>
          </div>
        ) : ranking.length === 0 ? (
          <p className="ranking-vazio">
            Ainda não existem pontuações no ranking.
            Seja o primeiro a aparecer por aqui!
          </p>
        ) : (
          <ol className="ranking-lista">
            {ranking.map((jogador, index) => (
              <li
                className={`ranking-linha ${
                  usuario?.id === jogador.user_id
                    ? "ranking-voce"
                    : ""
                }`}
                key={jogador.user_id}
              >
                <span className="ranking-posicao">
                  {index + 1}º
                </span>

                <span className="ranking-nome">
                  {jogador.nome_jogador}

                  {usuario?.id === jogador.user_id && (
                    <small>Você</small>
                  )}
                </span>

                <strong className="ranking-pontos">
                  {jogador.pontuacao}
                  <span> pts</span>
                </strong>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="resultado-botoes">
        <button
          type="button"
          className="btn btn-principal resultado-jogar"
          onClick={jogarNovamente}
        >
          <RotateCcw size={18} aria-hidden="true" />
          Jogar novamente
        </button>

        <button
          type="button"
          className="btn btn-contorno resultado-voltar"
          onClick={voltarMenu}
        >
          <Home size={18} aria-hidden="true" />
          Voltar ao menu
        </button>
      </div>

      <p className="resultado-rodape">
        <Sparkles size={13} aria-hidden="true" />
        Nakaback · Sua memória merece brilhar!
      </p>
    </main>
  );
}

export default Resultado;
