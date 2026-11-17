
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Sparkles,
  LockKeyhole,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  CircleAlert,
} from "lucide-react";
import { supabase } from "../services/supabase";
import "../styles/Identificacao.css";

const senhaSchema = z
  .object({
    senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
    confirmarSenha: z.string(),
  })
  .refine((dados) => dados.senha === dados.confirmarSenha, {
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

      setMensagem(
        "Senha alterada com sucesso! Agora você já pode entrar."
      );

      setSenha("");
      setConfirmarSenha("");
    } catch (error) {
      setErro(
        error.message ||
          "Não foi possível alterar sua senha. Solicite um novo link."
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
      <main className="identificacao-pagina">
        <div className="identificacao-fundo" aria-hidden="true">
          <span className="identificacao-estrela identificacao-estrela-1">✦</span>
          <span className="identificacao-estrela identificacao-estrela-2">✧</span>
          <span className="identificacao-orbe identificacao-orbe-1" />
        </div>

        <section className="identificacao-card">
          <div className="identificacao-icone">
            <ShieldCheck size={29} aria-hidden="true" />
          </div>

          <header className="identificacao-cabecalho">
            <h1>
              Verificando
              <span> link...</span>
            </h1>

            <p>
              Aguarde enquanto verificamos sua solicitação de recuperação
              de senha.
            </p>
          </header>

          <div className="redefinir-carregamento" role="status">
            <span className="redefinir-spinner" />
            <span>Verificando sua solicitação...</span>
          </div>
        </section>
      </main>
    );
  }

  if (!sessaoValida) {
    return (
      <main className="identificacao-pagina">
        <div className="identificacao-fundo" aria-hidden="true">
          <span className="identificacao-estrela identificacao-estrela-1">✦</span>
          <span className="identificacao-estrela identificacao-estrela-2">✧</span>
          <span className="identificacao-estrela identificacao-estrela-3">✦</span>
          <span className="identificacao-orbe identificacao-orbe-1" />
          <span className="identificacao-orbe identificacao-orbe-2" />
        </div>

        <section className="identificacao-card">
          <div className="redefinir-icone-erro">
            <CircleAlert size={30} aria-hidden="true" />
          </div>

          <header className="identificacao-cabecalho">
            <h1>
              Link inválido
              <span> ou expirado</span>
            </h1>

            <p>
              Não foi possível validar seu link de recuperação.
              Solicite um novo link na tela de login.
            </p>
          </header>

          {erro && (
            <p className="mensagem-erro" role="alert">
              {erro}
            </p>
          )}

          <button
            type="button"
            className="btn btn-principal identificacao-submit"
            onClick={() => navigate("/identificacao")}
          >
            <span>Voltar para o login</span>
            <ArrowRight size={19} aria-hidden="true" />
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="identificacao-pagina">
      <div className="identificacao-fundo" aria-hidden="true">
        <span className="identificacao-estrela identificacao-estrela-1">✦</span>
        <span className="identificacao-estrela identificacao-estrela-2">✧</span>
        <span className="identificacao-estrela identificacao-estrela-3">✦</span>
        <span className="identificacao-estrela identificacao-estrela-4">✧</span>
        <span className="identificacao-orbe identificacao-orbe-1" />
        <span className="identificacao-orbe identificacao-orbe-2" />
      </div>

      <section className="identificacao-card">
        <div className="identificacao-selo">
          <Sparkles size={16} aria-hidden="true" />
          <span>Proteja sua conta</span>
        </div>

        <div className="identificacao-icone">
          <KeyRound size={29} aria-hidden="true" />
        </div>

        <header className="identificacao-cabecalho">
          <h1>
            Redefinir
            <span> senha</span>
          </h1>

          <p>
            Crie uma nova senha para continuar jogando no Nakaback.
          </p>
        </header>

        <form
          className="identificacao-form"
          onSubmit={handleSubmit}
          noValidate
        >
          <label className="identificacao-campo">
            <span>Nova senha</span>

            <div className="identificacao-input-wrapper">
              <LockKeyhole size={19} aria-hidden="true" />

              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Digite sua nova senha"
                autoComplete="new-password"
                disabled={enviando || !!mensagem}
              />
            </div>
          </label>

          <label className="identificacao-campo">
            <span>Confirmar nova senha</span>

            <div className="identificacao-input-wrapper">
              <ShieldCheck size={19} aria-hidden="true" />

              <input
                type="password"
                value={confirmarSenha}
                onChange={(event) => setConfirmarSenha(event.target.value)}
                placeholder="Digite novamente sua senha"
                autoComplete="new-password"
                disabled={enviando || !!mensagem}
              />
            </div>
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
              className="btn btn-principal identificacao-submit"
              disabled={enviando}
            >
              <span>
                {enviando ? "Salvando..." : "Salvar nova senha"}
              </span>

              {!enviando && (
                <ArrowRight size={19} aria-hidden="true" />
              )}
            </button>
          )}
        </form>

        <button
          type="button"
          className="identificacao-voltar"
          onClick={voltarLogin}
        >
          <ArrowRight size={16} aria-hidden="true" />
          Voltar para o login
        </button>

        <p className="identificacao-rodape">
          <Sparkles size={14} aria-hidden="true" />
          Sua conta está quase pronta para uma nova aventura!
        </p>
      </section>
    </main>
  );
}

export default RedefinirSenha;
