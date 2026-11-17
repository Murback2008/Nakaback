import { useNavigate } from "react-router-dom";
import { Play, LogIn } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { figuras } from "../data/cartas";
import VersoCarta from "../components/VersoCarta";
import Marca from "../components/Marca";
import "../styles/Acesso.css";

function Acesso() {
  const navigate = useNavigate();
  const { usuario, carregando } = useAuth();

  const nome = usuario?.user_metadata?.nome || usuario?.email?.split("@")[0];
  const morango = figuras.find((f) => f.id === "morango");
  const cereja = figuras.find((f) => f.id === "cereja");

  return (
    <main className="pagina acesso">
      <div className="acesso-texto">
        <Marca tamanho={38} comNome={false} />

        <h1>Nakaback</h1>

        <p className="acesso-lema">
          Um jogo da memória para treinar a atenção sozinho ou disputar a dois.
        </p>

        <div className="acesso-botoes">
          <button
            type="button"
            className="btn btn-principal"
            onClick={() => navigate("/modo-jogo")}
          >
            <Play size={18} aria-hidden="true" />
            Começar a jogar
          </button>

          {!carregando && !usuario && (
            <button
              type="button"
              className="btn btn-contorno"
              onClick={() => navigate("/identificacao")}
            >
              <LogIn size={18} aria-hidden="true" />
              Entrar na minha conta
            </button>
          )}
        </div>

        {usuario && (
          <p className="acesso-saudacao">
            Que bom te ver, {nome}. Suas pontuações entram no ranking.
          </p>
        )}
      </div>

      <div className="leque" aria-hidden="true">
        <div className="leque-carta leque-esq">
          <img src={cereja.src} alt="" />
        </div>
        <div className="leque-carta leque-meio">
          <VersoCarta />
        </div>
        <div className="leque-carta leque-dir">
          <img src={morango.src} alt="" />
        </div>
      </div>
    </main>
  );
}

export default Acesso;
