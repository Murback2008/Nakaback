import "../styles/Menu.css";

function Interruptor({ ligado, aoAlternar, rotulo }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      aria-label={rotulo}
      className={`interruptor ${ligado ? "ligado" : ""}`}
      onClick={aoAlternar}
    >
      <span className="interruptor-bolinha" />
    </button>
  );
}

export default Interruptor;
