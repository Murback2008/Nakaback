
import { useNavigate } from "react-router-dom";
import {
  Play,
  LogIn,
  Sparkles,
  Star,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import Marca from "../components/Marca";
import "../styles/Acesso.css";

function Acesso() {
  const navigate = useNavigate();
  const { usuario, carregando } = useAuth();

  const nome =
    usuario?.user_metadata?.nome ||
    usuario?.email?.split("@")[0];

  return (
    <main className="pagina acesso">
      <div className="acesso-filtro" aria-hidden="true" />

      <div className="acesso-brilhos" aria-hidden="true">
        <Sparkles className="brilho brilho-1" />
        <Star className="brilho brilho-2" />
        <Sparkles className="brilho brilho-3" />
        <span className="particula particula-1" />
        <span className="particula particula-2" />
        <span className="particula particula-3" />
        <span className="particula particula-4" />
        <span className="particula particula-5" />
      </div>

      <section className="acesso-conteudo">
        <div className="acesso-marca">
          <Marca tamanho={48} comNome={false} />
        </div>

        <span className="acesso-etiqueta">
          <Sparkles size={15} />
          PREPARE-SE PARA JOGAR
          <Sparkles size={15} />
        </span>

        <h1 className="acesso-titulo">
          NAKA<span>BACK</span>
        </h1>

        <p className="acesso-descricao">
          Um mundo de cores, frutas e diversão!
          <br />
          Encontre os pares e desafie sua memória.
        </p>

        <div className="acesso-acoes">
          <button
            type="button"
            className="acesso-jogar"
            onClick={() => navigate("/modo-jogo")}
          >
            <span className="acesso-icone-jogar">
              <Play size={22} fill="currentColor" />
            </span>

            <span className="acesso-texto-jogar">
              <strong>JOGAR AGORA</strong>
              <small>Escolha seu desafio!</small>
            </span>

            <ArrowRight className="acesso-seta" size={22} />
          </button>

          {!carregando && !usuario && (
            <button
              type="button"
              className="acesso-login"
              onClick={() => navigate("/identificacao")}
            >
              <LogIn size={19} />
              ENTRAR NA MINHA CONTA
            </button>
          )}
        </div>

        {usuario && (
          <p className="acesso-saudacao">
            Que bom te ver, {nome}! ✨
            <br />
            Suas pontuações entram no ranking.
          </p>
        )}

        <div className="acesso-rodape">
          <span>1 OU 2 JOGADORES</span>
          <span className="acesso-pontinho">✦</span>
          <span>DESAFIE SUA MEMÓRIA</span>
        </div>
      </section>

      <section className="acesso-ilustracao" aria-label="Cartas do jogo">
        <div className="acesso-circulo" />

        <div className="acesso-frase">
          <Sparkles size={17} />
          <span>Encontre todos os pares!</span>
        </div>

        <div className="leque">
          <div className="leque-carta leque-esq">
            <span>🍓</span>
          </div>

          <div className="leque-carta leque-meio">
            <div className="leque-verso">
              <span>✦</span>
              <small>NAKA</small>
            </div>
          </div>

          <div className="leque-carta leque-dir">
            <span>🫐</span>
          </div>
        </div>

        <div className="acesso-dica">
          <span>🍒</span>
          <span>Memorize, combine e divirta-se!</span>
          <span>🍇</span>
        </div>
      </section>
    </main>
  );
}

export default Acesso;
