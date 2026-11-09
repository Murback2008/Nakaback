
import { useNavigate } from "react-router-dom";
import "../styles/ModoJogo.css";

function ModoJogo() {
  const navigate = useNavigate();

  function escolherModo(modo) {
    navigate("/dificuldade", {
      state: { modo },
    });
  }

  return (
    <main className="modo-container">
      <section className="modo-card">
        <h1>Escolha o modo de jogo</h1>

        <p>Como você deseja jogar?</p>

        <div className="modo-opcoes">
          <button
            className="modo-botao"
            onClick={() => escolherModo("um-jogador")}
          >
            <span>👤</span>
            <strong>Um jogador</strong>
            <small>Jogue individualmente e supere sua pontuação.</small>
          </button>

          <button
            className="modo-botao"
            onClick={() => escolherModo("dois-jogadores")}
          >
            <span>👥</span>
            <strong>Dois jogadores</strong>
            <small>Jogue com outra pessoa.</small>
          </button>
        </div>
      </section>
    </main>
  );
}

export default ModoJogo;
