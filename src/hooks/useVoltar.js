import { useNavigate } from "react-router-dom";

// Volta para a página anterior; se não houver histórico, vai para o início
export function useVoltar() {
  const navigate = useNavigate();

  return function voltar() {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };
}
