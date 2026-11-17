
function VersoCarta() {
  const petalas = [0, 45, 90, 135, 180, 225, 270, 315];

  const estrelas = [
    { x: 25, y: 31, tamanho: 2 },
    { x: 75, y: 31, tamanho: 2 },
    { x: 25, y: 89, tamanho: 2 },
    { x: 75, y: 89, tamanho: 2 },
    { x: 50, y: 17, tamanho: 2.5 },
    { x: 50, y: 103, tamanho: 2.5 },
  ];

  return (
    <svg
      className="verso-svg"
      viewBox="0 0 100 120"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="nakaback-verso-gradiente" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="50%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>

        <radialGradient id="nakaback-flor-gradiente">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ede9fe" />
        </radialGradient>
      </defs>

      <rect
        className="verso-fundo"
        width="100"
        height="120"
        fill="url(#nakaback-verso-gradiente)"
      />

      <rect
        className="verso-moldura"
        x="7"
        y="7"
        width="86"
        height="106"
        rx="10"
      />

      <rect
        x="12"
        y="12"
        width="76"
        height="96"
        rx="7"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.7"
      />

      <g transform="translate(50 60)">
        {petalas.map((angulo) => (
          <ellipse
            key={angulo}
            className="verso-petala"
            cx="0"
            cy="-15"
            rx="6.4"
            ry="13"
            transform={`rotate(${angulo})`}
            fill="url(#nakaback-flor-gradiente)"
          />
        ))}

        <circle
          className="verso-miolo"
          r="5"
          fill="#ffffff"
        />

        <circle
          r="2"
          fill="#a78bfa"
        />
      </g>

      {estrelas.map(({ x, y, tamanho }, indice) => (
        <g key={indice}>
          <path
            d={`M ${x} ${y - tamanho * 2} 
                L ${x + tamanho * 0.5} ${y - tamanho * 0.5}
                L ${x + tamanho * 2} ${y}
                L ${x + tamanho * 0.5} ${y + tamanho * 0.5}
                L ${x} ${y + tamanho * 2}
                L ${x - tamanho * 0.5} ${y + tamanho * 0.5}
                L ${x - tamanho * 2} ${y}
                L ${x - tamanho * 0.5} ${y - tamanho * 0.5} Z`}
            fill="#ffffff"
            opacity="0.85"
          />
        </g>
      ))}

      <circle cx="16" cy="16" r="1.5" className="verso-ponto" />
      <circle cx="84" cy="16" r="1.5" className="verso-ponto" />
      <circle cx="16" cy="104" r="1.5" className="verso-ponto" />
      <circle cx="84" cy="104" r="1.5" className="verso-ponto" />
    </svg>
  );
}

export default VersoCarta;
