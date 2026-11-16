import { useNavigate } from "react-router-dom";
import { User, Users } from "lucide-react";
import BotaoVoltar from "../components/BotaoVoltar";
import "../styles/ModoJogo.css";

function ModoJogo() {
  const navigate = useNavigate();

  function escolherModo(modo) {
    if (modo === "dois-jogadores") {
      // Os dois jogadores se identificam antes de escolher a dificuldade
      navigate("/jogadores", { state: { modo } });
      return;
    }

    navigate("/dificuldade", {
      state: { modo },
    });
  }

  return (
    <>
      <BotaoVoltar para="/" rotulo="Voltar ao início" />

      <main className="pagina pagina-estreita">
        <header className="pagina-cabecalho">
          <h1>Como você quer jogar?</h1>
          <p>Escolha o modo de jogo para começar.</p>
        </header>

        <div className="modo-opcoes">
          <button
            type="button"
            className="modo-botao"
            onClick={() => escolherModo("um-jogador")}
          >
            <span className="modo-icone">
              <User size={28} aria-hidden="true" />
            </span>
            <span className="modo-texto">
              <strong>Um jogador</strong>
              <small>Jogue individualmente e supere sua pontuação.</small>
            </span>
          </button>

          <button
            type="button"
            className="modo-botao"
            onClick={() => escolherModo("dois-jogadores")}
          >
            <span className="modo-icone">
              <Users size={28} aria-hidden="true" />
            </span>
            <span className="modo-texto">
              <strong>Dois jogadores</strong>
              <small>Revezem a vez no mesmo aparelho e vejam quem lembra mais.</small>
            </span>
          </button>
        </div>
      </main>
    </>
  );
}

export default ModoJogo;
