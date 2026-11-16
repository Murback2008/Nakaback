import { useCallback, useEffect, useRef, useState } from "react";
import { embaralharCartas, quantidadePares } from "../data/cartas";

const TEMPO_ERRO_MS = 1000;

/*
  Lógica de partida compartilhada pelo modo individual e pelo multiplayer.
  Ela só cuida das cartas, jogadas, tempo e do bloqueio durante um erro.
  Quem usa o hook decide o que acontece em cada acerto/erro (pontos, turnos).

  - Refs guardam o estado "síncrono" (seleção, bloqueio) para que cliques
    rápidos nunca virem mais de duas cartas.
  - Os callbacks ficam em uma ref para nunca serem lidos desatualizados.
  - O temporizador do erro é cancelado ao reiniciar e ao desmontar.
*/
export function useJogoMemoria(dificuldade, { aoAcertar, aoErrar } = {}) {
  const quantidade = quantidadePares[dificuldade] || 8;

  const [cartas, setCartas] = useState(() => embaralharCartas(dificuldade));
  const [selecionadas, setSelecionadas] = useState([]);
  const [jogadas, setJogadas] = useState(0);
  const [paresEncontrados, setParesEncontrados] = useState(0);
  const [tempo, setTempo] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);

  const cartasRef = useRef(cartas);
  const selecionadasRef = useRef([]);
  const bloqueioRef = useRef(false);
  const timeoutErroRef = useRef(null);
  const callbacksRef = useRef({ aoAcertar, aoErrar });

  const finalizada = paresEncontrados === quantidade;

  useEffect(() => {
    callbacksRef.current = { aoAcertar, aoErrar };
  });

  // Conta o tempo da partida (para quando todos os pares foram encontrados)
  useEffect(() => {
    if (finalizada) return undefined;

    const intervalo = setInterval(() => {
      setTempo((anterior) => anterior + 1);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [finalizada]);

  // Cancela o temporizador do erro ao sair da página
  useEffect(() => {
    return () => clearTimeout(timeoutErroRef.current);
  }, []);

  const selecionarCarta = useCallback((id) => {
    if (bloqueioRef.current) return;

    const carta = cartasRef.current.find((item) => item.id === id);

    if (!carta || carta.encontrada || selecionadasRef.current.includes(id)) {
      return;
    }

    const novasSelecionadas = [...selecionadasRef.current, id];
    selecionadasRef.current = novasSelecionadas;
    setSelecionadas(novasSelecionadas);

    if (novasSelecionadas.length < 2) return;

    setJogadas((anterior) => anterior + 1);

    const [idPrimeira, idSegunda] = novasSelecionadas;
    const primeira = cartasRef.current.find((item) => item.id === idPrimeira);
    const segunda = cartasRef.current.find((item) => item.id === idSegunda);

    if (primeira.figura === segunda.figura) {
      // As cartas são iguais
      const atualizadas = cartasRef.current.map((item) =>
        item.id === idPrimeira || item.id === idSegunda
          ? { ...item, encontrada: true }
          : item
      );

      cartasRef.current = atualizadas;
      selecionadasRef.current = [];

      setCartas(atualizadas);
      setParesEncontrados((anterior) => anterior + 1);
      setSelecionadas([]);

      callbacksRef.current.aoAcertar?.([idPrimeira, idSegunda]);
    } else {
      // As cartas são diferentes: bloqueia até as cartas voltarem a ficar escondidas
      bloqueioRef.current = true;
      setBloqueado(true);

      timeoutErroRef.current = setTimeout(() => {
        selecionadasRef.current = [];
        bloqueioRef.current = false;

        setSelecionadas([]);
        setBloqueado(false);

        callbacksRef.current.aoErrar?.();
      }, TEMPO_ERRO_MS);
    }
  }, []);

  const reiniciar = useCallback(() => {
    clearTimeout(timeoutErroRef.current);

    const novasCartas = embaralharCartas(dificuldade);

    cartasRef.current = novasCartas;
    selecionadasRef.current = [];
    bloqueioRef.current = false;

    setCartas(novasCartas);
    setSelecionadas([]);
    setJogadas(0);
    setParesEncontrados(0);
    setTempo(0);
    setBloqueado(false);
  }, [dificuldade]);

  return {
    cartas,
    selecionadas,
    jogadas,
    paresEncontrados,
    quantidade,
    tempo,
    bloqueado,
    finalizada,
    selecionarCarta,
    reiniciar,
  };
}
