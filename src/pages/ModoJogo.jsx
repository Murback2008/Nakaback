
import { useNavigate } from "react-router-dom";
import { UserRound, UsersRound, Sparkles, ArrowRight } from "lucide-react";
import BotaoVoltar from "../components/BotaoVoltar";
import "../styles/ModoJogo.css";

function ModoJogo() {
  const navigate = useNavigate();

  function escolherModo(modo) {
    if (modo === "dois-jogadores") {
      navigate("/jogadores", { state: { modo } });
      return;
    }

    navigate("/dificuldade", {
      state: { modo },
    });
  }

  return (
    <main className="modo-pagina">
      <div className="modo-fundo" aria-hidden="true">
        <span className="modo-estrela modo-estrela-1">✦</span>
        <span className="modo-estrela modo-estrela-2">✧</span>
        <span className="modo-estrela modo-estrela-3">✦</span>
        <span className="modo-estrela modo-estrela-4">✧</span>
        <span className="modo-orbe modo-orbe-1" />
        <span className="modo-orbe modo-orbe-2" />
      </div>

      <BotaoVoltar para="/" rotulo="Voltar ao início" />

      <section className="modo-conteudo">
        <div className="modo-selo">
          <Sparkles size={16} aria-hidden="true" />
          <span>Uma aventura começa aqui</span>
        </div>

        <header className="modo-cabecalho">
          <h1>
            Como você
            <span> quer jogar?</span>
          </h1>

          <p>
            Escolha sua forma de entrar nessa aventura
            e prepare sua memória para o desafio!
          </p>
        </header>

        <div className="modo-opcoes">
          <button
            type="button"
            className="modo-botao modo-botao-solo"
            onClick={() => escolherModo("um-jogador")}
          >
            <span className="modo-icone">
              <UserRound size={32} strokeWidth={1.8} aria-hidden="true" />
            </span>

            <span className="modo-texto">
              <strong>Um jogador</strong>
              <small>
                Uma aventura individual para testar sua memória e superar
                seus próprios recordes.
              </small>
            </span>

            <span className="modo-seta">
              <ArrowRight size={20} aria-hidden="true" />
            </span>
          </button>

          <button
            type="button"
            className="modo-botao modo-botao-dupla"
            onClick={() => escolherModo("dois-jogadores")}
          >
            <span className="modo-icone">
              <UsersRound size={32} strokeWidth={1.8} aria-hidden="true" />
            </span>

            <span className="modo-texto">
              <strong>Dois jogadores</strong>
              <small>
                Chame alguém para jogar com você no mesmo aparelho e
                descubram quem tem a melhor memória!
              </small>
            </span>

            <span className="modo-seta">
              <ArrowRight size={20} aria-hidden="true" />
            </span>
          </button>
        </div>

        <p className="modo-rodape">
          <Sparkles size={14} aria-hidden="true" />
          Cada partida é uma nova descoberta.
        </p>
      </section>
    </main>
  );
}

export default ModoJogo;
