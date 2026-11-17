import Carta from "./Carta";

/*
  Grade de cartas usada nos dois modos.
  `cores` (opcional) associa o id de uma carta encontrada à cor de quem a encontrou.
*/
function Tabuleiro({
  cartas,
  selecionadas,
  bloqueado,
  dificuldade,
  cores,
  aoEscolher,
}) {
  return (
    <div className={`cartas-grid cartas-${dificuldade}`}>
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
