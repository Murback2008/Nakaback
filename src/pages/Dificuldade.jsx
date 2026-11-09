
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Dificuldade.css";

function Dificuldade() {
  const navigate = useNavigate();
  const location = useLocation();

  const modo = location.state?.modo || "um-jogador";

  function escolherDificuldade(dificuldade) {
    navigate("/jogo", {
      state: {
        dificuldade,
        modo,
      },
    });
  }

  return (
    <main className="dificuldade-container">
      <section className="dificuldade-card">
        <h1>Escolha a dificuldade</h1>

        <p>Prepare-se para testar sua memória!</p>

        <div className="dificuldade-opcoes">
          <button
            className="dificuldade-botao facil"
            onClick={() => escolherDificuldade("facil")}
          >
            <span>🌱</span>
            <strong>Fácil</strong>
            <small>Para começar e treinar sua memória.</small>
          </button>

          <button
            className="dificuldade-botao medio"
            onClick={() => escolherDificuldade("medio")}
          >
            <span>⭐</span>
            <strong>Médio</strong>
            <small>Um desafio um pouco maior.</small>
          </button>

          <button
            className="dificuldade-botao dificil"
            onClick={() => escolherDificuldade("dificil")}
          >
            <span>🔥</span>
            <strong>Difícil</strong>
            <small>Teste sua memória ao máximo!</small>
          </button>
        </div>

        <button
          className="voltar-botao"
          onClick={() => navigate("/modo-jogo")}
        >
          Voltar
        </button>
      </section>
    </main>
  );
}

export default Dificuldade;
