import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../../hooks/userContext";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import SubNavbar from "../../componets/layoutComponets/navbar/secnavbar";
import AssetsSection1 from "../../componets/layoutComponets/pageSections/assets/section1";
import AssetsSection2 from "../../componets/layoutComponets/pageSections/assets/section2";
import AssetsSection3 from "../../componets/layoutComponets/pageSections/assets/section3";

import homePageStyle from "./homePage.module.css";
import buttonStyle from "../../componets/singleComponets/button/button.module.css";

import { logoutUser } from "../../utills/helpers/funtions";
import {
  navbarBtns,
  subnavbarBtns,
} from "../../utills/helpers/navbars/navbarBtns";
import {
  AssetsData,
  AssetSectionsData,
} from "../../utills/helpers/assets/assets";

export default function HomeAssets() {
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

  const subBtns = subnavbarBtns({
    category: assetsCategory,
    navigate,
    buttonStyle: buttonStyle.snbtns,
  });

  const [editCatId, setEditCatId] = useState(null);
  const toggleEdit = (catId) => {
    setEditCatId((prev) => (prev === catId ? null : catId));
  };

  const assetsData = AssetsData(assetsCategory, "consolidated");
  const assetsSectionData = AssetSectionsData(
    assetsCategory.subCategories || [],
    "consolidated",
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
          u_id={userData.user._id}
          dc_id={assetsCategory._id}
        />
      </header>
      <main className={homePageStyle.main}>
        <AssetsSection1 data={assetsData} categoryDetails={assetsCategory}/>
        <AssetsSection2 sections={assetsSectionData} u_id={userData.user._id} />
        <AssetsSection3 />
      </main>
      <footer></footer>
    </>
  );
}
