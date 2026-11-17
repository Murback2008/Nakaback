
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Sparkles,
  LockKeyhole,
  Mail,
  UserRound,
  ArrowRight,
  LogIn,
  UserPlus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Identificacao.css";

const cadastroSchema = z.object({
  nome: z.string().trim().min(2, "Digite seu nome completo."),
  email: z.string().trim().email("Digite um e-mail válido."),
  senha: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
});

const loginSchema = z.object({
  email: z.string().trim().email("Digite um e-mail válido."),
  senha: z.string().min(1, "Digite sua senha."),
});

function traduzirErro(mensagem) {
  const texto = (mensagem || "").toLowerCase();

  if (texto.includes("invalid login credentials")) {
    return "E-mail ou senha incorretos.";
  }

  if (texto.includes("email not confirmed")) {
    return "Confirme seu e-mail antes de entrar. Procure a mensagem de confirmação na sua caixa de entrada.";
  }

  if (texto.includes("already registered")) {
    return "Este e-mail já está cadastrado. Tente entrar.";
  }

  if (texto.includes("rate limit")) {
    return "Muitas tentativas. Aguarde um pouco e tente novamente.";
  }

  return mensagem || "Não foi possível realizar a operação.";
}

function Identificacao() {
  const [modo, setModo] = useState("login");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { cadastrar, entrar, recuperarSenha } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setMensagem("");

    const schema = modo === "cadastro" ? cadastroSchema : loginSchema;

    const dados =
      modo === "cadastro"
        ? { nome, email, senha }
        : { email, senha };

    const validacao = schema.safeParse(dados);

    if (!validacao.success) {
      setErro(validacao.error.issues[0].message);
      return;
    }

    setEnviando(true);

    try {
      if (modo === "cadastro") {
        const { data, error } = await cadastrar(
          validacao.data.nome,
          validacao.data.email,
          validacao.data.senha
        );

        if (error) throw error;

        if (!data.session) {
          setMensagem(
            "Cadastro realizado! Enviamos um e-mail de confirmação. Depois de confirmar, volte aqui e entre com seu e-mail e senha."
          );
          setModo("login");
          setSenha("");
        } else {
          navigate("/modo-jogo");
        }
      } else {
        const { error } = await entrar(
          validacao.data.email,
          validacao.data.senha
        );

        if (error) throw error;

        navigate("/modo-jogo");
      }
    } catch (error) {
      setErro(traduzirErro(error.message));
    } finally {
      setEnviando(false);
    }
  }

  async function handleRecuperarSenha() {
    setErro("");
    setMensagem("");

    const validacao = z
      .string()
      .trim()
      .email("Digite seu e-mail para recuperar a senha.")
      .safeParse(email);

    if (!validacao.success) {
      setErro(validacao.error.issues[0].message);
      return;
    }

    setEnviando(true);

    try {
      const { error } = await recuperarSenha(validacao.data);

      if (error) throw error;

      setMensagem(
        "Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha. Verifique também a caixa de spam."
      );
    } catch (error) {
      setErro(traduzirErro(error.message));
    } finally {
      setEnviando(false);
    }
  }

  const estaNoLogin = modo === "login";

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
          <span>Sua aventura começa aqui</span>
        </div>

        <div className="identificacao-icone">
          {estaNoLogin ? (
            <LogIn size={29} aria-hidden="true" />
          ) : (
            <UserPlus size={29} aria-hidden="true" />
          )}
        </div>

        <header className="identificacao-cabecalho">
          <h1>
            {estaNoLogin ? (
              <>
                Bem-vindo
                <span> de volta!</span>
              </>
            ) : (
              <>
                Crie sua
                <span> conta</span>
              </>
            )}
          </h1>

          <p>
            {estaNoLogin
              ? "Entre para salvar suas pontuações e acompanhar seu desempenho no ranking."
              : "Cadastre-se para guardar seus resultados e participar do ranking."}
          </p>
        </header>

        <div className="identificacao-opcoes" role="tablist" aria-label="Tipo de acesso">
          <button
            type="button"
            role="tab"
            aria-selected={estaNoLogin}
            className={estaNoLogin ? "selecionado" : ""}
            onClick={() => {
              setModo("login");
              setErro("");
              setMensagem("");
            }}
          >
            <LogIn size={17} aria-hidden="true" />
            Entrar
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={!estaNoLogin}
            className={!estaNoLogin ? "selecionado" : ""}
            onClick={() => {
              setModo("cadastro");
              setErro("");
              setMensagem("");
            }}
          >
            <UserPlus size={17} aria-hidden="true" />
            Criar conta
          </button>
        </div>

        <form
          className="identificacao-form"
          onSubmit={handleSubmit}
          noValidate
        >
          {modo === "cadastro" && (
            <label className="identificacao-campo">
              <span>Nome completo</span>

              <div className="identificacao-input-wrapper">
                <UserRound size={19} aria-hidden="true" />
                <input
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Digite seu nome"
                  autoComplete="name"
                />
              </div>
            </label>
          )}

          <label className="identificacao-campo">
            <span>E-mail</span>

            <div className="identificacao-input-wrapper">
              <Mail size={19} aria-hidden="true" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Digite seu e-mail"
                autoComplete="email"
              />
            </div>
          </label>

          <label className="identificacao-campo">
            <span>Senha</span>

            <div className="identificacao-input-wrapper">
              <LockKeyhole size={19} aria-hidden="true" />
              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder="Digite sua senha"
                autoComplete={
                  estaNoLogin ? "current-password" : "new-password"
                }
              />
            </div>
          </label>

          {estaNoLogin && (
            <button
              type="button"
              className="identificacao-esqueci"
              onClick={handleRecuperarSenha}
              disabled={enviando}
            >
              Esqueci minha senha
            </button>
          )}

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

          <button
            type="submit"
            className="btn btn-principal identificacao-submit"
            disabled={enviando}
          >
            <span>
              {enviando
                ? "Aguarde..."
                : estaNoLogin
                  ? "Entrar"
                  : "Cadastrar"}
            </span>

            {!enviando && (
              <ArrowRight size={19} aria-hidden="true" />
            )}
          </button>
        </form>

        <button
          type="button"
          className="identificacao-voltar"
          onClick={() => navigate("/")}
        >
          <ArrowRight size={16} aria-hidden="true" />
          Voltar ao início
        </button>

        <p className="identificacao-rodape">
          <Sparkles size={14} aria-hidden="true" />
          Sua próxima conquista está esperando por você!
        </p>
      </section>
    </main>
  );
}

export default Identificacao;
