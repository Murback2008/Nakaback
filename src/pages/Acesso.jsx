
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Acesso.css";

function Acesso() {
  const navigate = useNavigate();
  const { usuario, sair } = useAuth();

  async function handleSair() {
    const { error } = await sair();

    if (error) {
      alert("Não foi possível sair da conta.");
      return;
    }

    alert("Você saiu da sua conta!");
    navigate("/");
  }

  return (
    <main className="acesso-container">
      <section className="acesso-card">
        <div className="acesso-icone">🧠</div>

        <h1>Jogo da Memória</h1>

        <p>Teste sua memória e divirta-se!</p>

        <div className="acesso-botoes">
          <button
            className="acesso-botao principal"
            onClick={() => navigate("/modo-jogo")}
          >
            🎮 Começar a jogar
          </button>

          <button
            className="acesso-botao secundario"
            onClick={() => navigate("/identificacao")}
          >
            👤 Entrar na minha conta
          </button>

          {usuario && (
            <button
              className="acesso-botao sair"
              onClick={handleSair}
            >
              🚪 Sair da conta
            </button>
          )}
        </div>
      </section>
    </main>
  );
}

export default Acesso;
