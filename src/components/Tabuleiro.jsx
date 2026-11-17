
import Carta from "./Carta";

function Tabuleiro({
  cartas,
  selecionadas,
  bloqueado,
  dificuldade,
  cores,
  aoEscolher,
}) {
  return (
    <div
      className={`cartas-grid cartas-${dificuldade}`}
      aria-label="Tabuleiro do jogo da memória"
    >
      {cartas.map((carta) => (
        <Carta
          key={carta.id}
          carta={carta}
          virada={selecionadas.includes(carta.id) || carta.encontrada}
          desativada={carta.encontrada || bloqueado}
          cor={cores?.[carta.id]}
          aoEscolher={aoEscolher}
        />
      ))}
    </div>
  );
}

export default Tabuleiro;
