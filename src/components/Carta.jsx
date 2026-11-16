import { Check } from "lucide-react";
import VersoCarta from "./VersoCarta";
import "../styles/Carta.css";

function Carta({ carta, virada, desativada, cor, aoEscolher }) {
  const classes = [
    "carta",
    virada ? "carta-virada" : "",
    carta.encontrada ? "carta-encontrada" : "",
    cor ? "carta-com-dono" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={classes}
      style={cor ? { "--cor-dono": cor } : undefined}
      onClick={() => aoEscolher(carta.id)}
      disabled={desativada}
      aria-label={virada ? `Carta ${carta.nome}` : "Carta fechada"}
    >
      <span className="carta-giro">
        <span className="carta-face carta-verso">
          <VersoCarta />
        </span>

        <span className="carta-face carta-frente">
          <img src={carta.src} alt="" draggable="false" />
          {carta.encontrada && (
            <span className="carta-selo" aria-hidden="true">
              <Check size={13} strokeWidth={3} />
            </span>
          )}
        </span>
      </span>
    </button>
  );
}

export default Carta;
