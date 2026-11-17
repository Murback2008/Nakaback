
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, LogOut, UserRound } from "lucide-react";

import { useAuth } from "../context/AuthContext";

import "../styles/Menu.css";

function formatarData(valor) {
  if (!valor) return null;

  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return null;
  }

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Área do usuário na parte inferior do menu.
function PerfilMenu({ aoFechar }) {
  const { usuario, carregando, sair } = useAuth();

  const navigate = useNavigate();

  const [aberto, setAberto] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState("");

  // Fecha os detalhes do perfil quando o menu lateral é fechado.
  useEffect(() => {
    function fecharPerfil() {
      setAberto(false);
      setErro("");
    }

    window.addEventListener("fechar-perfil-menu", fecharPerfil);

    return () => {
      window.removeEventListener("fechar-perfil-menu", fecharPerfil);
    };
  }, []);

  if (carregando) {
    return null;
  }

  if (!usuario) {
    return (
      <div className="perfil-visitante">
        <p>
          Você está jogando sem conta. Entre para salvar suas pontuações
          no ranking.
        </p>

        <button
          type="button"
          className="btn btn-contorno"
          onClick={() => {
            aoFechar();
            navigate("/identificacao");
          }}
        >
          Entrar na minha conta
        </button>
      </div>
    );
  }

  const nome =
    usuario.user_metadata?.nome ||
    usuario.email?.split("@")[0] ||
    "Jogador";

  const detalhes = [
    ["Nome", nome],
    ["E-mail", usuario.email],
    ["Conta criada em", formatarData(usuario.created_at)],
    ["Último acesso", formatarData(usuario.last_sign_in_at)],
  ].filter(([, valor]) => Boolean(valor));

  function alternarPerfil() {
    setAberto((valor) => !valor);
    setErro("");
  }

  async function handleSair() {
    if (saindo) return;

    setErro("");
    setSaindo(true);

    try {
      const { error } = await sair();

      if (error) {
        setErro("Não foi possível sair da conta. Tente novamente.");
        return;
      }

      setAberto(false);
      aoFechar();
      navigate("/", { replace: true });
    } catch {
      setErro("Ocorreu um erro ao sair da conta. Tente novamente.");
    } finally {
      setSaindo(false);
    }
  }

  return (
    <div className="perfil">
      {aberto && (
        <div className="perfil-painel" id="perfil-painel">
          <dl>
            {detalhes.map(([rotulo, valor]) => (
              <div key={rotulo}>
                <dt>{rotulo}</dt>
                <dd>{valor}</dd>
              </div>
            ))}
          </dl>

          {erro && (
            <p className="mensagem-erro" role="alert">
              {erro}
            </p>
          )}

          <button
            type="button"
            className="btn btn-contorno perfil-sair"
            onClick={handleSair}
            disabled={saindo}
          >
            <LogOut size={18} aria-hidden="true" />

            {saindo ? "Saindo..." : "Sair da conta"}
          </button>
        </div>
      )}

      <button
        type="button"
        className="perfil-botao"
        onClick={alternarPerfil}
        aria-expanded={aberto}
        aria-controls="perfil-painel"
        aria-label={`${aberto ? "Ocultar" : "Mostrar"} informações de ${nome}`}
      >
        <span className="perfil-avatar" aria-hidden="true">
          {nome.charAt(0).toUpperCase()}
        </span>

        <span className="perfil-nome">{nome}</span>

        <ChevronUp
          size={18}
          className={`perfil-seta ${aberto ? "aberta" : ""}`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}

export default PerfilMenu;
