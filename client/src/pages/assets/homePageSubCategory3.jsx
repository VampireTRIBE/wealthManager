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
  logoutUser,
  subCategoryBtns,
  topCategoryBtns,
  useLiveDateTime,
} from "../../utills/helpers/funtions";
import { useFormData } from "../../hooks/fromdata";
import ProductSection from "../../componets/layoutComponets/pageSections/assets/productSection";

export default function HomeAssetsSub3() {
  const { u_id, dc_id, sc_id, ssc_id, sssc_id } = useParams();
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  const handleLogout = () => logoutUser(setUserData, navigate);
  const currentDate = useLiveDateTime();

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

  const assetsCategory = userData.categories.find((cat) => cat._id === dc_id);
  const assetsSubCategory = assetsCategory?.subCategories?.find(
    (cat) => cat._id === sc_id
  );
  const assetsSubCategory2 = assetsSubCategory?.subCategories?.find(
    (cat) => cat._id === ssc_id
  );
  const assetsSubCategory3 = assetsSubCategory2?.subCategories?.find(
    (cat) => cat._id === sssc_id
  );

  const subBtns = subCategoryBtns({
    category: assetsCategory,
    u_id,
    navigate,
    buttonStyle: buttonStyle.snbtns,
  });

  const assetsData = buildAssetsDataFromCategory(
    assetsSubCategory3,
    currentDate
  );

  const holdings = [
    {
      name: "GoldETF",
      data: {
        LTP: "1235",
        Qty: "145",
        price: "65",
        invested: "655151",
        current: "661161",
        "P/L": "5000",
        "p/l %": "8%",
        "Irr %": "8%",
        "realized gains": "51450",
      },
    },
    {
      name: "SilverETF",
      data: {
        LTP: "750",
        Qty: "200",
        price: "80",
        invested: "40000",
        current: "42000",
        "P/L": "2000",
        "p/l %": "5%",
        "Irr %": "6%",
        "realized gains": "1500",
      },
    },
  ];

  return (
    <>
      <header>
        <Navbar d_btns={d_btns} m_btns={m_btns} path={`/home/${u_id}`} />
        <SubNavbar d_btns={subBtns} />
      </header>
      <main className={homePageStyle.main}>
        <AssetsSection1 data={assetsData} />
        <ProductSection holdings={holdings} />
        <AssetsSection3 />
      </main>
      <footer></footer>
    </>
  );
}
