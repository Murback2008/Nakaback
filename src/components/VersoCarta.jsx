// Verso das cartas: uma flor de oito pétalas, a marca do Nakaback
function VersoCarta() {
  return (
    <svg
      className="verso-svg"
      viewBox="0 0 100 120"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect className="verso-fundo" width="100" height="120" />
      <rect className="verso-moldura" x="7" y="7" width="86" height="106" rx="10" />

      <g transform="translate(50 60)">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angulo) => (
          <ellipse
            key={angulo}
            className="verso-petala"
            cx="0"
            cy="-15"
            rx="6.4"
            ry="13"
            transform={`rotate(${angulo})`}
          />
        ))}
        <circle className="verso-miolo" r="4.6" />
      </g>

      {[
        [16, 16],
        [84, 16],
        [16, 104],
        [84, 104],
      ].map(([x, y]) => (
        <circle key={`${x}-${y}`} className="verso-ponto" cx={x} cy={y} r="1.8" />
      ))}
    </svg>
  );
}

export default VersoCarta;
