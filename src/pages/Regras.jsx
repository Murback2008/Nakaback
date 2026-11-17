import { Clock, Flame, Sprout, Star, Trophy } from "lucide-react";
import BotaoVoltar from "../components/BotaoVoltar";
import VersoCarta from "../components/VersoCarta";
import { figuras } from "../data/cartas";
import { useVoltar } from "../hooks/useVoltar";
import "../styles/Regras.css";

function MiniCarta({ figura }) {
  return (
    <span className={`mini-carta ${figura ? "frente" : ""}`} aria-hidden="true">
      {figura ? <img src={figura.src} alt="" /> : <VersoCarta />}
    </span>
  );
}

function Regras() {
  const voltar = useVoltar();
  const maca = figuras.find((f) => f.id === "maca");
  const kiwi = figuras.find((f) => f.id === "kiwi");

  return (
    <>
      <BotaoVoltar rotulo="Voltar" />

      <main className="pagina pagina-estreita regras">
        <header className="pagina-cabecalho">
          <h1>Regras do jogo</h1>
          <p>Tudo o que você precisa saber para começar a encontrar pares.</p>
        </header>

        <section className="regras-secao">
          <h2>Como jogar</h2>

          <ol className="regras-passos">
            <li>
              <div className="passo-visual">
                <MiniCarta />
                <MiniCarta />
              </div>
              <p>Todas as cartas começam viradas para baixo, com o verso do Nakaback.</p>
            </li>
            <li>
              <div className="passo-visual">
                <MiniCarta figura={maca} />
                <MiniCarta figura={kiwi} />
              </div>
              <p>Vire duas cartas por vez. Se as figuras forem diferentes, elas voltam a se esconder depois de um instante: memorize onde cada uma estava.</p>
            </li>
            <li>
              <div className="passo-visual">
                <MiniCarta figura={maca} />
                <MiniCarta figura={maca} />
              </div>
              <p>Se as figuras forem iguais, o par continua revelado e não pode mais ser escolhido.</p>
            </li>
            <li>
              <div className="passo-visual passo-icone">
                <Trophy size={28} />
              </div>
              <p>O jogo termina quando todos os pares forem encontrados.</p>
            </li>
          </ol>
        </section>

        <section className="regras-secao">
          <h2>Dificuldades</h2>

          <ul className="regras-dificuldades">
            <li><Sprout size={20} aria-hidden="true" /><strong>Fácil</strong> 6 pares, 12 cartas</li>
            <li><Star size={20} aria-hidden="true" /><strong>Médio</strong> 8 pares, 16 cartas</li>
            <li><Flame size={20} aria-hidden="true" /><strong>Difícil</strong> 12 pares, 24 cartas</li>
          </ul>
        </section>

        <section className="regras-secao">
          <h2>Individual ou em dupla</h2>

          <div className="tabela-rolagem">
            <table className="regras-tabela">
              <thead>
                <tr>
                  <td />
                  <th scope="col">Um jogador</th>
                  <th scope="col">Dois jogadores</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Como se joga</th>
                  <td>Você contra o tabuleiro.</td>
                  <td>Dois jogadores no mesmo aparelho, cada um com nome e cor.</td>
                </tr>
                <tr>
                  <th scope="row">Pontuação</th>
                  <td>100 pontos por par, menos 10 por jogada feita (nunca abaixo de zero).</td>
                  <td>1 ponto por par encontrado.</td>
                </tr>
                <tr>
                  <th scope="row">A vez</th>
                  <td>Sempre sua.</td>
                  <td>Quem acerta joga de novo. Quem erra passa a vez.</td>
                </tr>
                <tr>
                  <th scope="row">Fim da partida</th>
                  <td>Mostra sua pontuação, tempo e jogadas.</td>
                  <td>Vence quem tiver mais pares. Se houver o mesmo número, é empate.</td>
                </tr>
                <tr>
                  <th scope="row">Ranking</th>
                  <td>A melhor pontuação de quem estiver conectado entra no ranking.</td>
                  <td>Não conta para o ranking.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="regras-nota">
            <Clock size={16} aria-hidden="true" /> O tempo da partida é cronometrado nos dois modos.
          </p>
        </section>

        <button type="button" className="btn btn-contorno regras-voltar" onClick={voltar}>
          Voltar
        </button>
      </main>
    </>
  );
}

export default Regras;
