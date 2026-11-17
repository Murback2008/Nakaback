import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import BotaoVoltar from "../components/BotaoVoltar";
import { coresJogador } from "../data/jogadores";
import "../styles/Jogadores.css";

const nomeSchema = z
  .string()
  .trim()
  .min(1, "Digite um nome.")
  .max(16, "Use no máximo 16 caracteres.");

function inicial(jogador) {
  return (jogador.nome.trim().charAt(0) || "?").toUpperCase();
}

function Jogadores() {
  const navigate = useNavigate();
  const location = useLocation();

  // Ao voltar da escolha de dificuldade, os dados já digitados são mantidos
  const anteriores = location.state?.jogadores;

  const [jogadores, setJogadores] = useState(() => [
    {
      nome: anteriores?.[0]?.nome ?? "",
      cor: anteriores?.[0]?.corId ?? coresJogador[0].id,
    },
    {
      nome: anteriores?.[1]?.nome ?? "",
      cor: anteriores?.[1]?.corId ?? coresJogador[4].id,
    },
  ]);
  const [erros, setErros] = useState([null, null]);
  const [erroGeral, setErroGeral] = useState("");

  if (location.state?.modo !== "dois-jogadores" && !anteriores) {
    return <Navigate to="/modo-jogo" replace />;
  }

  function atualizar(indice, campos) {
    setJogadores((atuais) =>
      atuais.map((jogador, i) => (i === indice ? { ...jogador, ...campos } : jogador))
    );
    setErros((atuais) => atuais.map((erro, i) => (i === indice ? null : erro)));
    setErroGeral("");
  }

  function iniciar(evento) {
    evento.preventDefault();

    const novosErros = jogadores.map((jogador) => {
      const resultado = nomeSchema.safeParse(jogador.nome);
      return resultado.success ? null : resultado.error.issues[0].message;
    });

    const nomesIguais =
      !novosErros[0] &&
      !novosErros[1] &&
      jogadores[0].nome.trim().toLowerCase() === jogadores[1].nome.trim().toLowerCase();

    if (nomesIguais) {
      novosErros[1] = "Use um nome diferente do jogador 1.";
    }

    setErros(novosErros);

    if (novosErros.some(Boolean)) return;

    if (jogadores[0].cor === jogadores[1].cor) {
      setErroGeral("Cada jogador precisa de uma cor diferente.");
      return;
    }

    const configurados = jogadores.map((jogador) => {
      const cor = coresJogador.find((item) => item.id === jogador.cor);

      return {
        nome: jogador.nome.trim(),
        corId: cor.id,
        corNome: cor.nome,
        cor: cor.valor,
      };
    });

    navigate("/dificuldade", {
      state: { modo: "dois-jogadores", jogadores: configurados },
    });
  }

  return (
    <>
      <BotaoVoltar para="/modo-jogo" rotulo="Voltar aos modos de jogo" />

      <main className="pagina">
        <header className="pagina-cabecalho">
          <h1>Quem vai jogar?</h1>
          <p>Cada jogador escolhe um nome e uma cor para ser reconhecido durante a partida.</p>
        </header>

        <form className="jogadores-form" onSubmit={iniciar} noValidate>
          <div className="jogadores-colunas">
            {jogadores.map((jogador, indice) => {
              const corAtual = coresJogador.find((c) => c.id === jogador.cor);
              const outraCor = jogadores[1 - indice].cor;
              const idErro = `erro-jogador-${indice}`;

              return (
                <fieldset className="jogador" key={indice}>
                  <legend>Jogador {indice + 1}</legend>

                  <div className="jogador-previa" aria-live="polite">
                    <span
                      className="jogador-ficha"
                      style={{ background: corAtual.valor }}
                      aria-hidden="true"
                    >
                      {inicial(jogador)}
                    </span>
                    <span className="jogador-previa-texto">
                      <strong>{jogador.nome.trim() || `Jogador ${indice + 1}`}</strong>
                      <small>{corAtual.nome}</small>
                    </span>
                  </div>

                  <label className="jogador-campo">
                    Nome
                    <input
                      type="text"
                      value={jogador.nome}
                      onChange={(e) => atualizar(indice, { nome: e.target.value })}
                      placeholder={`Nome do jogador ${indice + 1}`}
                      maxLength={16}
                      autoComplete="off"
                      aria-invalid={Boolean(erros[indice])}
                      aria-describedby={erros[indice] ? idErro : undefined}
                    />
                  </label>

                  {erros[indice] && (
                    <p className="mensagem-erro" id={idErro} role="alert">
                      {erros[indice]}
                    </p>
                  )}

                  <div
                    className="jogador-cores"
                    role="radiogroup"
                    aria-label={`Cor do jogador ${indice + 1}`}
                  >
                    {coresJogador.map((cor) => {
                      const ocupada = cor.id === outraCor;
                      const selecionada = cor.id === jogador.cor;

                      return (
                        <button
                          key={cor.id}
                          type="button"
                          role="radio"
                          aria-checked={selecionada}
                          aria-label={ocupada ? `${cor.nome} (já escolhida pelo outro jogador)` : cor.nome}
                          title={ocupada ? "Já escolhida pelo outro jogador" : cor.nome}
                          disabled={ocupada}
                          className={`cor-opcao ${selecionada ? "selecionada" : ""}`}
                          style={{ "--cor": cor.valor }}
                          onClick={() => atualizar(indice, { cor: cor.id })}
                        />
                      );
                    })}
                  </div>
                </fieldset>
              );
            })}
          </div>

          {erroGeral && (
            <p className="mensagem-erro" role="alert">
              {erroGeral}
            </p>
          )}

          <button type="submit" className="btn btn-principal jogadores-iniciar">
            Escolher a dificuldade
          </button>
        </form>
      </main>
    </>
  );
}

export default Jogadores;
