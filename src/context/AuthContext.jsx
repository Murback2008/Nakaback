
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "../services/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Verifica se existe uma sessão ativa
  useEffect(() => {
    async function carregarSessao() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Erro ao carregar sessão:", error.message);
      }

      setUsuario(data?.session?.user ?? null);
      setCarregando(false);
    }

    carregarSessao();

    // Acompanha alterações no login e logout
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUsuario(session?.user ?? null);
      setCarregando(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Cadastrar novo jogador
  async function cadastrar(nome, email, senha) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          nome,
        },
        emailRedirectTo: `${window.location.origin}/modo-jogo`,
      },
    });

    return { data, error };
  }

  // Entrar na conta
  async function entrar(email, senha) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    return { data, error };
  }

  // Sair da conta
  async function sair() {
    const { error } = await supabase.auth.signOut();

    return { error };
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        cadastrar,
        entrar,
        sair,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Permite acessar a autenticação em qualquer página
export function useAuth() {
  const contexto = useContext(AuthContext);

  if (!contexto) {
    throw new Error(
      "useAuth deve ser usado dentro de AuthProvider"
    );
  }

  return contexto;
}
