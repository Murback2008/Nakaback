// Ilustrações das cartas (arquivos locais em src/assets/cartas)
const imagens = import.meta.glob("../assets/cartas/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});

const ordem = [
  ["morango", "Morango"],
  ["melancia", "Melancia"],
  ["abacaxi", "Abacaxi"],
  ["cereja", "Cereja"],
  ["uva", "Uva"],
  ["banana", "Banana"],
  ["maca", "Maçã"],
  ["laranja", "Laranja"],
  ["kiwi", "Kiwi"],
  ["coco", "Coco"],
  ["mirtilo", "Mirtilo"],
  ["pessego", "Pêssego"],
];

export const figuras = ordem.map(([id, nome]) => ({
  id,
  nome,
  src: imagens[`../assets/cartas/${id}.svg`],
}));

export const quantidadePares = {
  facil: 6,
  medio: 8,
  dificil: 12,
};

export const nomesDificuldade = {
  facil: "Fácil",
  medio: "Médio",
  dificil: "Difícil",
};

// Embaralha as cartas (mesma lógica do jogo original, agora com imagens)
export function embaralharCartas(dificuldade) {
  const quantidade = quantidadePares[dificuldade] || 8;

  const selecionados = figuras.slice(0, quantidade);

  return [...selecionados, ...selecionados]
    .map((figura, index) => ({
      id: index,
      figura: figura.id,
      nome: figura.nome,
      src: figura.src,
      encontrada: false,
    }))
    .sort(() => Math.random() - 0.5);
}

export function formatarTempo(segundos) {
  const minutos = Math.floor(segundos / 60);
  const resto = segundos % 60;

  return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
}
