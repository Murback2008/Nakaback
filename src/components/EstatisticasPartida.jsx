import { Clock, Target, Trophy } from "lucide-react";
import { formatarTempo } from "../data/cartas";

function EstatisticasPartida({ tempo, jogadas, pares, quantidade }) {
  return (
    <dl className="jogo-estatisticas">
      <div>
        <dt>
          <Clock size={16} aria-hidden="true" /> Tempo
        </dt>
        <dd>{formatarTempo(tempo)}</dd>
      </div>
      <div>
        <dt>
          <Target size={16} aria-hidden="true" /> Jogadas
        </dt>
        <dd>{jogadas}</dd>
      </div>
      <div>
        <dt>
          <Trophy size={16} aria-hidden="true" /> Pares
        </dt>
        <dd>
          {pares}/{quantidade}
        </dd>
      </div>
    </dl>
  );
}

export default EstatisticasPartida;
