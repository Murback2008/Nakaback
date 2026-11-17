import { useContext } from "react";
import { MusicaContext } from "../context/musicaContext";

export function useMusica() {
  const contexto = useContext(MusicaContext);

  if (!contexto) {
    throw new Error("useMusica deve ser usado dentro de MusicaProvider");
  }

  return contexto;
}
