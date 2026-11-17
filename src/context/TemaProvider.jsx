import { useCallback, useEffect, useMemo, useState } from "react";
import { TemaContext } from "./temaContext";

const CHAVE_TEMA = "nakaback:tema";

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

  // Aplica o tema na raiz do documento e guarda a preferência
  useEffect(() => {
    document.documentElement.setAttribute("data-tema", tema);

    try {
      localStorage.setItem(CHAVE_TEMA, tema);
    } catch {
      // Sem acesso ao localStorage: o tema vale apenas para esta visita
    }
  }, [tema]);

  const alternarTema = useCallback(() => {
    setTema((atual) => (atual === "claro" ? "escuro" : "claro"));
  }, []);

  const valor = useMemo(
    () => ({ tema, escuro: tema === "escuro", alternarTema }),
    [tema, alternarTema]
  );

  return <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>;
}
