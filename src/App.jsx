
import { useEffect } from "react";
import { supabase } from "./services/supabase";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Acesso from "./pages/Acesso";
import ModoJogo from "./pages/ModoJogo";
import Identificacao from "./pages/Identificacao";
import Dificuldade from "./pages/Dificuldade";
import Jogo from "./pages/Jogo";
import Resultado from "./pages/Resultado";

function App() {
  useEffect(() => {
    async function testarConexao() {
      const { data, error } = await supabase
        .from("pontuacoes")
        .select("id")
        .limit(1);

      if (error) {
        console.error("Erro na conexão com Supabase:", error.message);
      } else {
        console.log("Supabase conectado com sucesso!", data);
      }
    }

    testarConexao();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Acesso />} />
        <Route path="/modo-jogo" element={<ModoJogo />} />
        <Route path="/identificacao" element={<Identificacao />} />
        <Route path="/dificuldade" element={<Dificuldade />} />
        <Route path="/jogo" element={<Jogo />} />
        <Route path="/resultado" element={<Resultado />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
