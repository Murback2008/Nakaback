import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "../styles/Menu.css";

function formatarData(valor) {
  if (!valor) return null;

  const data = new Date(valor);
  if (Number.isNaN(data.getTime())) return null;

  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Área do usuário na parte inferior do menu. Só mostra dados reais do Supabase.
function PerfilMenu({ aoFechar }) {
  const { usuario, carregando, sair } = useAuth();
  const navigate = useNavigate();

  const [aberto, setAberto] = useState(false);
  const [saindo, setSaindo] = useState(false);
  const [erro, setErro] = useState("");

  if (carregando) return null;

  if (!usuario) {
    return (
      <div className="perfil-visitante">
        <p>Você está jogando sem conta. Entre para salvar suas pontuações no ranking.</p>
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
    usuario.user_metadata?.nome || usuario.email?.split("@")[0] || "Jogador";

  const detalhes = [
    ["Nome", nome],
    ["E-mail", usuario.email],
    ["Conta criada em", formatarData(usuario.created_at)],
    ["Último acesso", formatarData(usuario.last_sign_in_at)],
  ].filter(([, valor]) => Boolean(valor));

  async function handleSair() {
    setErro("");
    setSaindo(true);

    const { error } = await sair();

    setSaindo(false);

    if (error) {
      setErro("Não foi possível sair da conta. Tente novamente.");
      return;
    }

    aoFechar();
    navigate("/");
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

          {erro && <p className="mensagem-erro" role="alert">{erro}</p>}

          <button
            type="button"
            className="btn btn-contorno perfil-sair"
            onClick={handleSair}
            disabled={saindo}
          >
            <LogOut size={18} />
            {saindo ? "Saindo..." : "Sair da conta"}
          </button>
        </div>
      )}

      <button
        type="button"
        className="perfil-botao"
        onClick={() => setAberto((valor) => !valor)}
        aria-expanded={aberto}
        aria-controls="perfil-painel"
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
