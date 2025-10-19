import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import api from "../servises/apis/apis";
import { useUser } from "../hooks/userContext";
import useTitle from "../hooks/useTitle";

import Navbar from "../componets/layoutComponets/navbar/navbar";
import HomeDashbord from "../componets/layoutComponets/main/dashbords/homedashbord";

import buttonStyle from "../componets/singleComponets/button/button.module.css";
import { logoutUser, topCategoryBtns } from "../utills/helpers/funtions";

export default function HomeDashbordPage() {
  useTitle("Wealth Manager - Home");
  const { u_id } = useParams();
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  const handleLogout = () => logoutUser(setUserData, navigate);
  const d_btns = topCategoryBtns({
    userData,
    u_id,
    navigate,
    handleLogout,
    buttonStyle: buttonStyle.dnbutton,
  });

  const m_btns = topCategoryBtns({
    userData,
    u_id,
    navigate,
    handleLogout,
    buttonStyle: buttonStyle.mnbtns,
  });

  return (
    <>
      <header>
        <Navbar d_btns={d_btns} m_btns={m_btns} path={`/home/${u_id}`} />
      </header>
      <>
        <HomeDashbord />
      </>
      <footer></footer>
    </>
  );
}
