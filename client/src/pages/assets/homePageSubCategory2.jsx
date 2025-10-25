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
  buildSubAssetSectionsFromCategories,
  generateHoldings,
  logoutUser,
  subCategoryBtns,
  topCategoryBtns,
} from "../../utills/helpers/funtions";
import { useFormData } from "../../hooks/fromdata";
import ProductSection from "../../componets/layoutComponets/pageSections/assets/productSection";

export default function HomeAssetsSub2() {
  const { sc, ssc } = useParams();
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

  const subBtns = subCategoryBtns({
    category: assetsCategory,
    navigate,
    buttonStyle: buttonStyle.snbtns,
  });

  const [editCatId, setEditCatId] = useState(null);
  const toggleEdit = (catId) => {
    setEditCatId((prev) => (prev === catId ? null : catId));
  };

  const assetsData = buildAssetsDataFromCategory(assetsSubCategory2);
  const assetsSectionData = buildSubAsset2SectionsFromCategories(
    assetsSubCategory2.subCategories || [],
    sc,
    ssc,
    toggleEdit,
    editCatId,
    navigate
  );
  const holdings = generateHoldings(assetsSubCategory2);
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
        <AssetsSection1
          data={assetsData}
          u_id={userData._id}
          id={assetsSubCategory2._id}
        />
        <AssetsSection2 sections={assetsSectionData} u_id={userData._id} />
        <ProductSection
          holdings={holdings}
          u_id={userData._id}
          c_id={assetsSubCategory2._id}
        />
        <AssetsSection3 />
      </main>
      <footer></footer>
    </>
  );
}
