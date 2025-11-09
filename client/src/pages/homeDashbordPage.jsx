import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/userContext";
import useTitle from "../hooks/useTitle";

import Navbar from "../componets/layoutComponets/navbar/navbar";

import buttonStyle from "../componets/singleComponets/button/button.module.css";

import { logoutUser } from "../utills/helpers/funtions";
import { navbarBtns } from "../utills/helpers/navbars/navbarBtns";

export default function HomeDashbordPage() {
  useTitle("Wealth Manager - Home");
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  const handleLogout = () => logoutUser(setUserData, navigate);
  const d_btns = navbarBtns({
    userData,
    navigate,
    handleLogout,
    buttonStyle: buttonStyle.dnbutton,
  });

  const m_btns = navbarBtns({
    userData,
    navigate,
    handleLogout,
    buttonStyle: buttonStyle.mnbtns,
  });

  return (
    <>
      <header>
        <Navbar d_btns={d_btns} m_btns={m_btns} path={`/home`} />
      </header>

      <footer></footer>
    </>
  );
}
