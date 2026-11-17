import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { CircleAlert, MailCheck } from "lucide-react";
import { supabase } from "../services/supabase";
import Marca from "../components/Marca";
import "../styles/Confirmado.css";

// Lê o que o Supabase anexou ao link do e-mail (antes de o cliente limpar a URL)
function lerRetornoDoLink() {
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const busca = new URLSearchParams(window.location.search);

  const erro =
    hash.get("error_description") ||
    busca.get("error_description") ||
    hash.get("error") ||
    busca.get("error");

  const veioDoEmail =
    hash.has("access_token") ||
    hash.has("token_hash") ||
    busca.has("code") ||
    busca.has("token_hash");

  return { erro, veioDoEmail };
}

/*
  Página aberta pelo link do e-mail de confirmação.
  O Supabase cria uma sessão ao confirmar; aqui ela é encerrada neste
  aparelho para que a confirmação NÃO leve direto ao jogo. A conta continua
  confirmada e a pessoa entra normalmente pela página de login.
*/
function Confirmado() {
  const navigate = useNavigate();
  const [retorno] = useState(lerRetornoDoLink);
  const [estado, setEstado] = useState(retorno.erro ? "erro" : "verificando");

  useEffect(() => {
    if (retorno.erro || !retorno.veioDoEmail) return undefined;

    let cancelado = false;

    // O Supabase avisa o login do link com um pequeno atraso: ao receber o
    // aviso, a sessão é encerrada para que a pessoa não entre direto no jogo.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((evento, sessao) => {
      if (sessao && (evento === "SIGNED_IN" || evento === "INITIAL_SESSION")) {
        setTimeout(() => supabase.auth.signOut({ scope: "local" }), 0);
      }
    });

    async function finalizar() {
      // Espera o Supabase processar o link e então encerra a sessão local
      const { data, error } = await supabase.auth.getSession();

      if (data?.session) {
        await supabase.auth.signOut({ scope: "local" });
      }

      if (!cancelado) setEstado(error ? "erro" : "ok");
    }

    finalizar();

    return () => {
      cancelado = true;
      subscription.unsubscribe();
    };
  }, [retorno]);

  // Acesso direto à página, sem passar pelo link do e-mail
  if (!retorno.erro && !retorno.veioDoEmail) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="pagina pagina-estreita confirmado">
      <Marca tamanho={38} />

      {estado === "verificando" && (
        <p className="confirmado-texto" role="status">Confirmando sua conta...</p>
      )}

      {estado === "ok" && (
        <>
          <MailCheck size={44} className="confirmado-icone" aria-hidden="true" />
          <h1>Conta confirmada!</h1>
          <p className="confirmado-texto">
            Tudo certo com o seu e-mail. Agora é só entrar com seu e-mail e sua senha.
          </p>
          <button
            type="button"
            className="btn btn-principal"
            onClick={() => navigate("/identificacao", { replace: true })}
          >
            Ir para o login
          </button>
        </>
      )}

      {estado === "erro" && (
        <>
          <CircleAlert size={44} className="confirmado-icone erro" aria-hidden="true" />
          <h1>Não foi possível confirmar</h1>
          <p className="confirmado-texto">
            O link pode ter expirado ou já ter sido usado. Tente entrar: se sua conta já
            estiver confirmada, o login vai funcionar. Caso contrário, cadastre-se novamente
            para receber um novo e-mail.
          </p>
          <button
            type="button"
            className="btn btn-principal"
            onClick={() => navigate("/identificacao", { replace: true })}
          >
            Ir para o login
          </button>
        </>
      )}
    </main>
  );
}

export default Confirmado;
