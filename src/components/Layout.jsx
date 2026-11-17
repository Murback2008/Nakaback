
import { useCallback, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import MenuLateral from "./MenuLateral";
import "../styles/Menu.css";

// Envolve todas as páginas com o botão de menu e o menu lateral.
function Layout() {
  const location = useLocation();

  // Guarda a navegação em que o menu foi aberto.
  // Quando a rota muda, o menu fecha automaticamente.
  const [abertoEm, setAbertoEm] = useState(null);

  const aberto = abertoEm === location.key;

  const fechar = useCallback(() => {
    setAbertoEm(null);
  }, []);

  function alternarMenu() {
    setAbertoEm(aberto ? null : location.key);
  }

  return (
    <>
      <button
        type="button"
        className={`menu-botao ${aberto ? "aberto" : ""}`}
        onClick={alternarMenu}
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={aberto}
        aria-controls="menu-lateral"
      >
        <span />
        <span />
        <span />
      </button>

      <MenuLateral
        aberto={aberto}
        aoFechar={fechar}
      />

      <Outlet />
    </>
  );
}

export default Layout;
