import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../servises/apis/apis";
import { useUser } from "../../hooks/userContext";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import SubNavbar from "../../componets/layoutComponets/navbar/secnavbar";
import AssetsSection1 from "../../componets/layoutComponets/pageSections/assets/section1";
import AssetsSection2 from "../../componets/layoutComponets/pageSections/assets/section2";
import AssetsSection3 from "../../componets/layoutComponets/pageSections/assets/section3";

import homePageStyle from "./homePage.module.css";
import buttonStyle from "../../componets/singleComponets/button/button.module.css";

import {
  buildAssetsDataFromCategory,
  buildAssetSectionsFromCategories,
  logoutUser,
  subCategoryBtns,
  topCategoryBtns,
} from "../../utills/helpers/funtions";

export default function HomeAssets() {
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

  const subBtns = subCategoryBtns({
    category: assetsCategory,
    navigate,
    buttonStyle: buttonStyle.snbtns,
  });

  const [editCatId, setEditCatId] = useState(null);
  const toggleEdit = (catId) => {
    setEditCatId((prev) => (prev === catId ? null : catId));
  };

  const assetsData = buildAssetsDataFromCategory(assetsCategory);
  const assetsSectionData = buildAssetSectionsFromCategories(
    assetsCategory.subCategories || [],
    toggleEdit,
    editCatId,
    navigate
  );

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
        <AssetsSection2 sections={assetsSectionData} u_id={userData._id} />
        <AssetsSection3 />
      </main>
      <footer></footer>
    </>
  );
}
