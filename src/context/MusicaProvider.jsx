import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MusicaContext } from "./musicaContext";

const CHAVE_MUSICA = "nakaback:musica";
const ARQUIVO_MUSICA = "/audio/nakaback-loop.mp3";
const VOLUME_PADRAO = 0.35;

function lerPreferencias() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_MUSICA));

    return {
      ativa: salvo?.ativa !== false,
      volume:
        typeof salvo?.volume === "number"
          ? Math.min(1, Math.max(0, salvo.volume))
          : VOLUME_PADRAO,
    };
  } catch {
    return { ativa: true, volume: VOLUME_PADRAO };
  }
}

/*
  O provider fica acima das rotas (em main.jsx), por isso o elemento <audio>
  é criado uma única vez e a música não reinicia ao trocar de página.
  Os navegadores bloqueiam áudio automático: se a música estiver ativada,
  ela começa na primeira interação do usuário com a página.
*/
export function MusicaProvider({ children }) {
  const [preferencias, setPreferencias] = useState(lerPreferencias);
  const [tocando, setTocando] = useState(false);
  const audioRef = useRef(null);

  const { ativa, volume } = preferencias;

  // Cria o player uma única vez
  useEffect(() => {
    const audio = new Audio(ARQUIVO_MUSICA);
    audio.loop = true;
    audio.preload = "auto";

    const aoTocar = () => setTocando(true);
    const aoPausar = () => setTocando(false);

    audio.addEventListener("play", aoTocar);
    audio.addEventListener("pause", aoPausar);
    audioRef.current = audio;

    return () => {
      audio.removeEventListener("play", aoTocar);
      audio.removeEventListener("pause", aoPausar);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  // Volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Liga/desliga conforme a preferência
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    if (!ativa) {
      audio.pause();
      return undefined;
    }

    let removido = false;
    const eventos = ["pointerdown", "keydown", "touchstart"];

    function removerEscutas() {
      removido = true;
      eventos.forEach((evento) =>
        window.removeEventListener(evento, aoInteragir)
      );
    }

    function aoInteragir() {
      if (removido) return;
      removerEscutas();
      audio.play().catch(() => {});
    }

    audio
      .play()
      .catch(() => {
        // Autoplay bloqueado: tenta de novo na primeira interação
        if (!removido) {
          eventos.forEach((evento) =>
            window.addEventListener(evento, aoInteragir, { once: true })
          );
        }
      });

    return removerEscutas;
  }, [ativa]);

  // Guarda a preferência
  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_MUSICA, JSON.stringify({ ativa, volume }));
    } catch {
      // Sem acesso ao localStorage: vale apenas para esta visita
    }
  }, [ativa, volume]);

  const alternarMusica = useCallback(() => {
    setPreferencias((atual) => ({ ...atual, ativa: !atual.ativa }));
  }, []);

  const definirVolume = useCallback((novoVolume) => {
    setPreferencias((atual) => ({
      ...atual,
      volume: Math.min(1, Math.max(0, Number(novoVolume) || 0)),
    }));
  }, []);

  const valor = useMemo(
    () => ({ ativa, volume, tocando, alternarMusica, definirVolume }),
    [ativa, volume, tocando, alternarMusica, definirVolume]
  );

  return (
    <MusicaContext.Provider value={valor}>{children}</MusicaContext.Provider>
  );
}
