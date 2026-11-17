import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Flame, Sprout, Star } from "lucide-react";
import BotaoVoltar from "../components/BotaoVoltar";
import "../styles/Dificuldade.css";

const opcoes = [
  { id: "facil", nome: "Fácil", detalhe: "6 pares", texto: "Para começar e treinar sua memória.", Icone: Sprout },
  { id: "medio", nome: "Médio", detalhe: "8 pares", texto: "Um desafio um pouco maior.", Icone: Star },
  { id: "dificil", nome: "Difícil", detalhe: "12 pares", texto: "Teste sua memória ao máximo!", Icone: Flame },
];

function Dificuldade() {
  const navigate = useNavigate();
  const location = useLocation();

  const modo = location.state?.modo || "um-jogador";
  const jogadores = location.state?.jogadores;
  const multiplayer = modo === "dois-jogadores";

  // No multiplayer os jogadores precisam estar configurados
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
    <>
      <BotaoVoltar
        para={multiplayer ? "/jogadores" : "/modo-jogo"}
        state={multiplayer ? { modo, jogadores } : undefined}
      />

      <main className="pagina pagina-estreita">
        <header className="pagina-cabecalho">
          <h1>Escolha a dificuldade</h1>
          <p>Prepare-se para testar sua memória!</p>
        </header>

        <div className="dificuldade-opcoes">
          {opcoes.map(({ id, nome, detalhe, texto, Icone }) => (
            <button
              key={id}
              type="button"
              className="dificuldade-botao"
              onClick={() => escolherDificuldade(id)}
            >
              <span className="dificuldade-icone">
                <Icone size={24} aria-hidden="true" />
              </span>
              <span className="dificuldade-texto">
                <strong>{nome}</strong>
                <small>{texto}</small>
              </span>
              <span className="dificuldade-pares">{detalhe}</span>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}

export default Dificuldade;
