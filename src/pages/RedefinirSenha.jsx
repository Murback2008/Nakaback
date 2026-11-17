
import "../styles/Identificacao.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "../services/supabase";

const senhaSchema = z.object({
  senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
  confirmarSenha: z.string(),
}).refine((dados) => dados.senha === dados.confirmarSenha, {
  message: "As senhas não são iguais.",
  path: ["confirmarSenha"],
});

function RedefinirSenha() {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sessaoValida, setSessaoValida] = useState(false);
  const [verificando, setVerificando] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let ativo = true;

    async function verificarSessao() {
      const { data, error } = await supabase.auth.getSession();

      if (!ativo) return;

      const sessao = data?.session;

      setSessaoValida(
        !error &&
        !!sessao &&
        sessao.user.aud === "authenticated"
      );

      if (error) {
        setErro("Não foi possível verificar o link de recuperação.");
      }

      setVerificando(false);
    }

    verificarSessao();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!ativo) return;

      if (event === "PASSWORD_RECOVERY") {
        setSessaoValida(!!session);
      }
    });

    return () => {
      ativo = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setMensagem("");

    const validacao = senhaSchema.safeParse({
      senha,
      confirmarSenha,
    });

    if (!validacao.success) {
      setErro(validacao.error.issues[0].message);
      return;
    }

    setEnviando(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: validacao.data.senha,
      });

      if (error) throw error;

      setMensagem("Senha alterada com sucesso! Agora você já pode entrar.");

      setSenha("");
      setConfirmarSenha("");
    } catch (error) {
      setErro(
        error.message || "Não foi possível alterar sua senha. Solicite um novo link."
      );
    } finally {
      setEnviando(false);
    }
  }

  async function voltarLogin() {
    await supabase.auth.signOut();
    navigate("/identificacao");
  }

  if (verificando) {
    return (
      <main className="pagina pagina-estreita identificacao">
        <section className="identificacao-card">
          <h1>Verificando link...</h1>
          <p>Aguarde enquanto verificamos sua solicitação.</p>
        </section>
      </main>
    );
  }

  if (!sessaoValida) {
    return (
      <main className="pagina pagina-estreita identificacao">
        <section className="identificacao-card">
          <h1>Link inválido ou expirado</h1>

          <p>
            Não foi possível validar seu link de recuperação.
            Solicite um novo link na tela de login.
          </p>

          {erro && (
            <p className="mensagem-erro" role="alert">
              {erro}
            </p>
          )}

          <button
            type="button"
            className="btn btn-principal"
            onClick={() => navigate("/identificacao")}
          >
            Voltar para o login
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="pagina pagina-estreita identificacao">
      <section className="identificacao-card">
        <h1>Redefinir senha</h1>

        <p>
          Crie uma nova senha para continuar jogando no Nakaback.
        </p>

        <form onSubmit={handleSubmit}>
          <label>
            Nova senha
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua nova senha"
              autoComplete="new-password"
              disabled={enviando || !!mensagem}
            />
          </label>

          <label>
            Confirmar nova senha
            <input
              type="password"
              value={confirmarSenha}
              onChange={(event) => setConfirmarSenha(event.target.value)}
              placeholder="Digite novamente sua senha"
              autoComplete="new-password"
              disabled={enviando || !!mensagem}
            />
          </label>

          {erro && (
            <p className="mensagem-erro" role="alert">
              {erro}
            </p>
          )}

          {mensagem && (
            <p className="mensagem-sucesso" role="status">
              {mensagem}
            </p>
          )}

          {!mensagem && (
            <button
              type="submit"
              className="btn btn-principal"
              disabled={enviando}
            >
              {enviando ? "Salvando..." : "Salvar nova senha"}
            </button>
          )}
        </form>

        <button
          type="button"
          className="btn-link voltar"
          onClick={voltarLogin}
        >
          Voltar para o login
        </button>
      </section>
    </main>
  );
}

export default RedefinirSenha;
