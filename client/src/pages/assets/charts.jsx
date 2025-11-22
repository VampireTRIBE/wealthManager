import { useUser } from "../../hooks/userContext";
import { useUserCurve } from "../../hooks/userCurveContex";
import useTitle from "../../hooks/useTitle";

import AssetsNavbar from "../../componets/layoutComponets/pageSections/assets/SubSections/assetsNavbar";

import homePageStyle from "./homePage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { logoutUser } from "../../utills/helpers/funtions";
import Navbar from "../../componets/layoutComponets/navbar/navbar";
import buttonStyle from "../../componets/singleComponets/button/button.module.css";
import CurveGraph from "../../componets/layoutComponets/pageSections/assets/SubSections/curve";
import S2CurveGraph from "../../componets/layoutComponets/pageSections/assets/SubSections/s2curve";

export default function ChartsPage() {
  const { name, flag } = useParams();
  useTitle(`Wealth Manager - Charts`);
  const { userData, setUserData } = useUser();
  const { userCurveData, setUserCurveData } = useUserCurve();

  const navigate = useNavigate();
  const handleLogout = () => logoutUser(setUserData, navigate);

  const CurveData = userCurveData.find((cat) => cat.categoryName === name);
  return (
    <>
      <header>
        <Navbar d_btns={[]} m_btns={[]} path="" />
      </header>
      <main>
        <S2CurveGraph
          categoryData={CurveData}
          flag={flag}
          isFullScreen={"true"}
        />
      </main>
      <footer></footer>
    </>
  );
}
