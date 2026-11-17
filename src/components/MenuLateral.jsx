
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Moon,
  Music,
  Sun,
  Volume2,
  Sparkles,
} from "lucide-react";

import { useTema } from "../hooks/useTema";
import { useMusica } from "../hooks/useMusica";

import Interruptor from "./Interruptor";
import Marca from "./Marca";
import PerfilMenu from "./PerfilMenu";

import "../styles/Menu.css";

function MenuLateral({ aberto, aoFechar }) {
  const navigate = useNavigate();

  const { escuro, alternarTema } = useTema();

  const {
    ativa,
    volume,
    alternarMusica,
    definirVolume,
  } = useMusica();

  // Fecha o menu com Escape e impede a rolagem da página ao fundo.
  useEffect(() => {
    if (!aberto) return undefined;

    function aoTeclar(evento) {
      if (evento.key === "Escape") {
        aoFechar();
      }
    }

    window.addEventListener("keydown", aoTeclar);
    document.body.classList.add("sem-rolagem");

    return () => {
      window.removeEventListener("keydown", aoTeclar);
      document.body.classList.remove("sem-rolagem");
    };
  }, [aberto, aoFechar]);

  function abrirRegras() {
    aoFechar();
    navigate("/regras");
  }

  return (
    <>
      <div
        className={`menu-veu ${aberto ? "aberto" : ""}`}
        onClick={aoFechar}
        aria-hidden="true"
      />

      <aside
        id="menu-lateral"
        className={`menu ${aberto ? "aberto" : ""}`}
        aria-label="Menu de configurações e navegação"
        aria-hidden={!aberto}
        inert={!aberto}
      >
        <header className="menu-topo">
          <Marca tamanho={30} />

          <span className="menu-subtitulo">
            <Sparkles size={13} aria-hidden="true" />
            Personalize sua experiência
          </span>
        </header>

        <div className="menu-corpo">
          <div className="menu-item">
            <div className="menu-linha">
              <span className="menu-rotulo">
                <Music size={20} aria-hidden="true" />
                Música de fundo
              </span>

              <Interruptor
                ligado={ativa}
                aoAlternar={alternarMusica}
                rotulo="Música de fundo"
              />
            </div>

            <label
              className={`menu-volume ${ativa ? "" : "desligado"}`}
            >
              <Volume2 size={18} aria-hidden="true" />

              <span className="sr-only">
                Volume da música
              </span>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(evento) =>
                  definirVolume(Number(evento.target.value))
                }
                disabled={!ativa}
                aria-label="Volume da música"
                style={{
                  "--preenchimento": `${volume * 100}%`,
                }}
              />

              <span className="menu-volume-valor">
                {Math.round(volume * 100)}%
              </span>
            </label>
          </div>

          <div className="menu-item">
            <div className="menu-linha">
              <span className="menu-rotulo">
                {escuro ? (
                  <Moon size={20} aria-hidden="true" />
                ) : (
                  <Sun size={20} aria-hidden="true" />
                )}

                Tema escuro
              </span>

              <Interruptor
                ligado={escuro}
                aoAlternar={alternarTema}
                rotulo="Tema escuro"
              />
            </div>
          </div>

          <div className="menu-item">
            <button
              type="button"
              className="menu-link"
              onClick={abrirRegras}
            >
              <BookOpen size={20} aria-hidden="true" />
              Regras do jogo
            </button>
          </div>
        </div>

        <footer className="menu-rodape">
          <PerfilMenu aoFechar={aoFechar} />
        </footer>
      </aside>
    </>
  );
}

export default MenuLateral;
