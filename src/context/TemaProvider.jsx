
import { useCallback, useEffect, useMemo, useState } from "react";
import { TemaContext } from "./temaContext";

const CHAVE_TEMA = "nakaback:tema";

// Recupera o tema salvo no navegador.
function lerTemaSalvo() {
  try {
    const salvo = localStorage.getItem(CHAVE_TEMA);

    return salvo === "escuro" ? "escuro" : "claro";
  } catch {
    return "claro";
  }
}

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(lerTemaSalvo);

  // Aplica o tema no documento e salva a preferência.
  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema);

    try {
      localStorage.setItem(CHAVE_TEMA, tema);
    } catch {
      // Se o armazenamento estiver indisponível,
      // o tema continuará funcionando durante esta visita.
    }
  }, [tema]);

  // Alterna entre os temas claro e escuro.
  const alternarTema = useCallback(() => {
    setTema((atual) =>
      atual === "claro" ? "escuro" : "claro"
    );
  }, []);

  // Disponibiliza os dados e funções para os componentes.
  const valor = useMemo(
    () => ({
      tema,
      escuro: tema === "escuro",
      alternarTema,
    }),
    [tema, alternarTema]
  );

  return (
    <TemaContext.Provider value={valor}>
      {children}
    </TemaContext.Provider>
  );
}
