import { useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MenuLateral from "./MenuLateral";
import "../styles/Menu.css";

// Envolve todas as páginas com o botão ☰ e o menu lateral
function Layout() {
  const location = useLocation();

  // O menu guarda em qual navegação foi aberto: ao mudar de rota ele fecha sozinho
  const [abertoEm, setAbertoEm] = useState(null);
  const aberto = abertoEm === location.key;

  const fechar = useCallback(() => setAbertoEm(null), []);

  return (
    <>
      <button
        type="button"
        className={`menu-botao ${aberto ? "aberto" : ""}`}
        onClick={() => setAbertoEm(aberto ? null : location.key)}
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={aberto}
        aria-controls="menu-lateral"
      >
        <span />
        <span />
        <span />
      </button>

      <MenuLateral aberto={aberto} aoFechar={fechar} />

      <Outlet />
    </>
  );
}

export default Layout;
