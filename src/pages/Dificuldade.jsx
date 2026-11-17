
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Flame, Sprout, Star, Sparkles, ArrowRight } from "lucide-react";
import BotaoVoltar from "../components/BotaoVoltar";
import "../styles/Dificuldade.css";

const opcoes = [
  {
    id: "facil",
    nome: "Fácil",
    detalhe: "6 pares",
    texto: "Para começar e treinar sua memória.",
    descricao: "Uma aventura tranquila",
    Icone: Sprout,
  },
  {
    id: "medio",
    nome: "Médio",
    detalhe: "8 pares",
    texto: "Um desafio um pouco maior.",
    descricao: "Um desafio encantado",
    Icone: Star,
  },
  {
    id: "dificil",
    nome: "Difícil",
    detalhe: "12 pares",
    texto: "Teste sua memória ao máximo!",
    descricao: "Para verdadeiros mestres",
    Icone: Flame,
  },
];

function Dificuldade() {
  const navigate = useNavigate();
  const location = useLocation();

  const modo = location.state?.modo || "um-jogador";
  const jogadores = location.state?.jogadores;
  const multiplayer = modo === "dois-jogadores";

  if (multiplayer && !jogadores) {
    return <Navigate to="/jogadores" replace state={{ modo }} />;
  }

  function escolherDificuldade(dificuldade) {
    navigate("/jogo", {
      state: {
        dificuldade,
        modo,
        ...(multiplayer ? { jogadores } : {}),
      },
    });
  }

  return (
    <main className="dificuldade-pagina">
      <div className="dificuldade-fundo" aria-hidden="true">
        <span className="dificuldade-estrela dificuldade-estrela-1">✦</span>
        <span className="dificuldade-estrela dificuldade-estrela-2">✧</span>
        <span className="dificuldade-estrela dificuldade-estrela-3">✦</span>
        <span className="dificuldade-estrela dificuldade-estrela-4">✧</span>
        <span className="dificuldade-orbe dificuldade-orbe-1" />
        <span className="dificuldade-orbe dificuldade-orbe-2" />
      </div>

      <BotaoVoltar
        para={multiplayer ? "/jogadores" : "/modo-jogo"}
        state={multiplayer ? { modo, jogadores } : undefined}
      />

      <section className="dificuldade-conteudo">
        <div className="dificuldade-selo">
          <Sparkles size={16} aria-hidden="true" />
          <span>Escolha seu desafio</span>
        </div>

        <header className="dificuldade-cabecalho">
          <h1>
            Qual será o seu
            <span> desafio?</span>
          </h1>

          <p>
            Cada nível guarda uma aventura diferente.
            Escolha aquele que combina com você!
          </p>
        </header>

        <div className="dificuldade-opcoes">
          {opcoes.map(({ id, nome, detalhe, texto, descricao, Icone }) => (
            <button
              key={id}
              type="button"
              className={`dificuldade-botao dificuldade-${id}`}
              onClick={() => escolherDificuldade(id)}
            >
              <span className="dificuldade-icone">
                <Icone size={28} strokeWidth={1.8} aria-hidden="true" />
              </span>

              <span className="dificuldade-texto">
                <strong>{nome}</strong>
                <small>{texto}</small>
                <span className="dificuldade-descricao">{descricao}</span>
              </span>

              <span className="dificuldade-final">
                <span className="dificuldade-pares">{detalhe}</span>
                <span className="dificuldade-seta">
                  <ArrowRight size={19} aria-hidden="true" />
                </span>
              </span>
            </button>
          ))}
        </div>

        <p className="dificuldade-rodape">
          <Sparkles size={14} aria-hidden="true" />
          Concentre-se, encontre os pares e divirta-se!
        </p>
      </section>
    </main>
  );
}

export default Dificuldade;
