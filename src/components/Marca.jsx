import "../styles/Navegacao.css";

// Marca do Nakaback: duas cartas sobrepostas, uma delas virada
function Marca({ tamanho = 32, comNome = true }) {
  return (
    <span className="marca">
      <svg width={tamanho} height={tamanho} viewBox="0 0 64 64" aria-hidden="true">
        <rect x="9" y="12" width="30" height="40" rx="7" transform="rotate(-10 24 32)" className="marca-carta-1" />
        <rect x="25" y="12" width="30" height="40" rx="7" transform="rotate(8 40 32)" className="marca-carta-2" />
        <path d="M40 24c5 3 6 9 0 16-6-7-5-13 0-16z" className="marca-petala" />
      </svg>
      {comNome && <span className="marca-nome">Nakaback</span>}
    </span>
  );
}

export default Marca;
