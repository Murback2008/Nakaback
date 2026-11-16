import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useVoltar } from "../hooks/useVoltar";
import "../styles/Navegacao.css";

// Botão discreto, só com seta. `para` define o destino; sem ele, volta uma página.
function BotaoVoltar({ para, state, rotulo = "Voltar" }) {
  const navigate = useNavigate();
  const voltarPagina = useVoltar();

  function voltar() {
    if (para) {
      navigate(para, { state });
    } else {
      voltarPagina();
    }
  }

  return (
    <button
      type="button"
      className="botao-voltar"
      onClick={voltar}
      aria-label={rotulo}
      title={rotulo}
    >
      <ArrowLeft size={22} />
    </button>
  );
}

export default BotaoVoltar;
