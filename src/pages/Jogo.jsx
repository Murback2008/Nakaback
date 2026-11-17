
import { Navigate, useLocation } from "react-router-dom";
import PartidaIndividual from "../components/PartidaIndividual";
import PartidaMultiplayer from "../components/PartidaMultiplayer";
import "../styles/Jogo.css";

function Jogo() {
  const location = useLocation();

  const dificuldade = location.state?.dificuldade || "medio";
  const modo = location.state?.modo || "um-jogador";
  const jogadores = location.state?.jogadores;

  if (modo === "dois-jogadores") {
    if (!jogadores || jogadores.length !== 2) {
      return (
        <Navigate
          to="/jogadores"
          replace
          state={{ modo: "dois-jogadores" }}
        />
      );
    }

    return (
      <PartidaMultiplayer
        dificuldade={dificuldade}
        jogadores={jogadores}
      />
    );
  }

  return (
    <PartidaIndividual
      dificuldade={dificuldade}
      modo={modo}
    />
  );
}

export default Jogo;
