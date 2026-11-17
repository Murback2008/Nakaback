
import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { supabase } from "./services/supabase";

import Layout from "./components/Layout";

import Acesso from "./pages/Acesso";
import ModoJogo from "./pages/ModoJogo";
import Identificacao from "./pages/Identificacao";
import Dificuldade from "./pages/Dificuldade";
import Jogadores from "./pages/Jogadores";
import Jogo from "./pages/Jogo";
import Resultado from "./pages/Resultado";
import ResultadoMultiplayer from "./pages/ResultadoMultiplayer";
import Regras from "./pages/Regras";
import Confirmado from "./pages/Confirmado";
import RedefinirSenha from "./pages/RedefinirSenha";

// Testa a conexão com o Supabase ao iniciar a aplicação.
function App() {
  useEffect(() => {
    async function testarConexao() {
      const { data, error } = await supabase
        .from("pontuacoes")
        .select("id")
        .limit(1);

      if (error) {
        console.error(
          "Erro na conexão com Supabase:",
          error.message
        );
      } else {
        console.log(
          "Supabase conectado com sucesso!",
          data
        );
      }
    }

    testarConexao();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Entrada e modos de jogo */}
          <Route path="/" element={<Acesso />} />
          <Route path="/modo-jogo" element={<ModoJogo />} />

          {/* Autenticação */}
          <Route path="/identificacao" element={<Identificacao />} />
          <Route path="/confirmado" element={<Confirmado />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />

          {/* Configuração da partida */}
          <Route path="/jogadores" element={<Jogadores />} />
          <Route path="/dificuldade" element={<Dificuldade />} />

          {/* Partida e resultados */}
          <Route path="/jogo" element={<Jogo />} />
          <Route path="/resultado" element={<Resultado />} />
          <Route
            path="/resultado-multiplayer"
            element={<ResultadoMultiplayer />}
          />

          {/* Instruções */}
          <Route path="/regras" element={<Regras />} />
        </Route>

        {/* Qualquer endereço inexistente retorna à página inicial */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
