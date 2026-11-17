
import { Clock, Target, Trophy, Sparkles } from "lucide-react";
import { formatarTempo } from "../data/cartas";

function EstatisticasPartida({ tempo, jogadas, pares, quantidade }) {
  return (
    <dl className="jogo-estatisticas">
      <div className="estatistica-item estatistica-tempo">
        <dt>
          <span className="estatistica-icone">
            <Clock size={19} aria-hidden="true" />
          </span>
          <span>Tempo</span>
        </dt>

        <dd>{formatarTempo(tempo)}</dd>
      </div>

      <div className="estatistica-item estatistica-jogadas">
        <dt>
          <span className="estatistica-icone">
            <Target size={19} aria-hidden="true" />
          </span>
          <span>Jogadas</span>
        </dt>

        <dd>{jogadas}</dd>
      </div>

      <div className="estatistica-item estatistica-pares">
        <dt>
          <span className="estatistica-icone">
            <Trophy size={19} aria-hidden="true" />
          </span>
          <span>Pares encontrados</span>
        </dt>

        <dd>
          {pares}
          <span className="estatistica-total"> / {quantidade}</span>
        </dd>

        <div
          className="estatistica-progresso"
          role="progressbar"
          aria-label="Progresso dos pares encontrados"
          aria-valuemin={0}
          aria-valuemax={quantidade}
          aria-valuenow={pares}
        >
          <span
            style={{
              width: `${quantidade > 0 ? Math.min((pares / quantidade) * 100, 100) : 0}%`,
            }}
          />
        </div>
      </div>

      <span className="estatistica-brilho" aria-hidden="true">
        <Sparkles size={15} />
      </span>
    </dl>
  );
}

export default EstatisticasPartida;
