import { useNavigate } from "react-router-dom";

import { useUser } from "../../../../../hooks/userContext";

import Navbar from "../../../navbar/navbar";
import SubNavbar from "../../../navbar/secnavbar";

import { logoutUser } from "../../../../../utills/helpers/funtions";
import {
  navbarBtns,
  subnavbarBtns,
} from "../../../../../utills/helpers/navbars/navbarBtns";

import buttonStyle from "../../../../singleComponets/button/button.module.css";

export default function AssetsNavbar({ categoryName, flag = false }) {
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

  const Category = userData.categories.find((cat) => cat.Name === categoryName);

  const subBtns = subnavbarBtns({
    category: Category,
    navigate,
    buttonStyle: buttonStyle.snbtns,
  });

  return (
    <header>
      <Navbar d_btns={d_btns} m_btns={m_btns} path={`/assets`} />
      {flag ? (
        ""
      ) : (
        <SubNavbar
          d_btns={subBtns}
          u_id={userData.user._id}
          dc_id={Category._id}
        />
      )}
    </header>
  );
}
