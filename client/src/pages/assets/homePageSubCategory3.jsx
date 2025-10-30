import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../hooks/userContext";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import SubNavbar from "../../componets/layoutComponets/navbar/secnavbar";

import AssetsSection1 from "../../componets/layoutComponets/pageSections/assets/section1";
import AssetsSection3 from "../../componets/layoutComponets/pageSections/assets/section3";
import ProductSection from "../../componets/layoutComponets/pageSections/assets/productSection";

import homePageStyle from "./homePage.module.css";
import buttonStyle from "../../componets/singleComponets/button/button.module.css";

import {
  logoutUser,
} from "../../utills/helpers/funtions";
import { navbarBtns, subnavbarBtns } from "../../utills/helpers/navbars/navbarBtns";
import { AssetsData, HoldingsData} from "../../utills/helpers/assets/assets";

export default function HomeAssetsSub3() {
  const { sc, ssc, sssc } = useParams();
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

  const assetsCategory = userData.categories.find(
    (cat) => cat.Name === "ASSETS"
  );
  const assetsSubCategory = assetsCategory?.subCategories?.find(
    (cat) => cat.Name === sc
  );
  const assetsSubCategory2 = assetsSubCategory?.subCategories?.find(
    (cat) => cat.Name === ssc
  );
  const assetsSubCategory3 = assetsSubCategory2?.subCategories?.find(
    (cat) => cat.Name === sssc
  );

  const subBtns = subnavbarBtns({
    category: assetsCategory,
    navigate,
    buttonStyle: buttonStyle.snbtns,
  });

  const assetsData = AssetsData(assetsSubCategory3,"consolidated");
  const holdings = HoldingsData(assetsSubCategory3);

  return (
    <>
      <header>
        <Navbar d_btns={d_btns} m_btns={m_btns} path={`/home`} />
        <SubNavbar
          d_btns={subBtns}
          u_id={userData.user._id}
          dc_id={assetsCategory._id}
        />
      </header>
      <main className={homePageStyle.main}>
        <AssetsSection1 data={assetsData} />
        <ProductSection
          holdings={holdings}
          u_id={userData.user._id}
          c_id={assetsSubCategory3._id}
        />
        <AssetsSection3 />
      </main>
      <footer></footer>
    </>
  );
}
