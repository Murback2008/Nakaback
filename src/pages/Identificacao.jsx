
import "../styles/Identificacao.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../context/AuthContext";

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

  const { cadastrar, entrar } = useAuth();
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

  return (
    <main className="pagina pagina-estreita identificacao">
      <section className="identificacao-card">
        <h1>
          {modo === "login" ? "Bem-vindo de volta!" : "Crie sua conta"}
        </h1>

        <p>
          {modo === "login"
            ? "Entre para salvar suas pontuações no ranking."
            : "Cadastre-se para participar do ranking."}
        </p>

        <div className="identificacao-opcoes">
          <button
            type="button"
            className={modo === "login" ? "selecionado" : ""}
            onClick={() => {
              setModo("login");
              setErro("");
              setMensagem("");
            }}
          >
            Entrar
          </button>

          <button
            type="button"
            className={modo === "cadastro" ? "selecionado" : ""}
            onClick={() => {
              setModo("cadastro");
              setErro("");
              setMensagem("");
            }}
          >
            Criar conta
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {modo === "cadastro" && (
            <label>
              Nome
              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Digite seu nome"
                autoComplete="name"
              />
            </label>
          )}

          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Digite seu e-mail"
              autoComplete="email"
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={senha}
              onChange={(event) => setSenha(event.target.value)}
              placeholder="Digite sua senha"
              autoComplete={
                modo === "login" ? "current-password" : "new-password"
              }
            />
          </label>

          {erro && <p className="mensagem-erro" role="alert">{erro}</p>}
          {mensagem && <p className="mensagem-sucesso" role="status">{mensagem}</p>}

          <button type="submit" className="btn btn-principal" disabled={enviando}>
            {enviando
              ? "Aguarde..."
              : modo === "login"
                ? "Entrar"
                : "Cadastrar"}
          </button>
        </form>

        <button
          type="button"
          className="btn-link voltar"
          onClick={() => navigate("/")}
        >
          Voltar
        </button>
      </section>
    </main>
  );
}

export default Identificacao;
