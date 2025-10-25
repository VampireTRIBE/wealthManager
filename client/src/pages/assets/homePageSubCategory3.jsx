import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import api from "../../servises/apis/apis";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import SubNavbar from "../../componets/layoutComponets/navbar/secnavbar";
import Home from "../../componets/layoutComponets/main/dashbords/assets/home";
import Button from "../../componets/singleComponets/button/button";
import Image from "../../componets/singleComponets/image/image";

import buttonStyle from "../../componets/singleComponets/button/button.module.css";
import imgStyle from "../../componets/singleComponets/image/image.module.css";
import AssetsSection1 from "../../componets/layoutComponets/pageSections/assets/section1";
import AssetsSection2 from "../../componets/layoutComponets/pageSections/assets/section2";
import homePageStyle from "./homePage.module.css";
import AssetsSection3 from "../../componets/layoutComponets/pageSections/assets/section3";
import { useUser } from "../../hooks/userContext";
import {
  buildAssetsDataFromCategory,
  buildAssetSectionsFromCategories,
  buildSubAsset2SectionsFromCategories,
  buildSubAsset3SectionsFromCategories,
  buildSubAssetSectionsFromCategories,
  generateHoldings,
  logoutUser,
  subCategoryBtns,
  topCategoryBtns,
  useLiveDateTime,
} from "../../utills/helpers/funtions";
import { useFormData } from "../../hooks/fromdata";
import ProductSection from "../../componets/layoutComponets/pageSections/assets/productSection";

export default function HomeAssetsSub3() {
  const { sc, ssc, sssc } = useParams();
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  const handleLogout = () => logoutUser(setUserData, navigate);

  const d_btns = topCategoryBtns({
    userData,
    navigate,
    handleLogout,
    buttonStyle: buttonStyle.dnbutton,
  });

  const m_btns = topCategoryBtns({
    userData,
    navigate,
    handleLogout,
    buttonStyle: buttonStyle.mnbtns,
  });

  const assetsCategory = userData.categories.find(
    (cat) => cat.name === "ASSETS"
  );
  const assetsSubCategory = assetsCategory?.subCategories?.find(
    (cat) => cat.name === sc
  );
  const assetsSubCategory2 = assetsSubCategory?.subCategories?.find(
    (cat) => cat.name === ssc
  );
  const assetsSubCategory3 = assetsSubCategory2?.subCategories?.find(
    (cat) => cat.name === sssc
  );

  const subBtns = subCategoryBtns({
    category: assetsCategory,
    navigate,
    buttonStyle: buttonStyle.snbtns,
  });

  const assetsData = buildAssetsDataFromCategory(assetsSubCategory3);

  const holdings = generateHoldings(assetsSubCategory3);

  return (
    <>
      <header>
        <Navbar d_btns={d_btns} m_btns={m_btns} path={`/home`} />
        <SubNavbar
          d_btns={subBtns}
          u_id={userData._id}
          dc_id={assetsCategory._id}
        />
      </header>
      <main className={homePageStyle.main}>
        <AssetsSection1 data={assetsData} />
        <ProductSection
          holdings={holdings}
          u_id={userData._id}
          c_id={assetsSubCategory3._id}
        />
        <AssetsSection3 />
      </main>
      <footer></footer>
    </>
  );
}
