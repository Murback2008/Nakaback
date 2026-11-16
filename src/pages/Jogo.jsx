import { Navigate, useLocation } from "react-router-dom";
import PartidaIndividual from "../components/PartidaIndividual";
import PartidaMultiplayer from "../components/PartidaMultiplayer";
import "../styles/Jogo.css";

// Escolhe o modo de partida a partir do que foi selecionado nas páginas anteriores
function Jogo() {
  const location = useLocation();

  const dificuldade = location.state?.dificuldade || "medio";
  const modo = location.state?.modo || "um-jogador";
  const jogadores = location.state?.jogadores;

  if (modo === "dois-jogadores") {
    // Sem jogadores configurados (ex.: página recarregada), volta para a configuração
    if (!jogadores) {
      return <Navigate to="/jogadores" replace state={{ modo }} />;
    }

    return <PartidaMultiplayer dificuldade={dificuldade} jogadores={jogadores} />;
  }

  return <PartidaIndividual dificuldade={dificuldade} modo={modo} />;
}

export default Jogo;
