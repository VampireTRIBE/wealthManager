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
  buildSubAssetSectionsFromCategories,
  generateHoldings,
  logoutUser,
  subCategoryBtns,
  topCategoryBtns,
  useLiveDateTime,
} from "../../utills/helpers/funtions";
import { useFormData } from "../../hooks/fromdata";
import ProductSection from "../../componets/layoutComponets/pageSections/assets/productSection";

export default function HomeAssetsSub() {
  const { u_id, dc_id, sc_id } = useParams();
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

  const subBtns = subCategoryBtns({
    category: assetsCategory,
    u_id,
    navigate,
    buttonStyle: buttonStyle.snbtns,
  });

  const handleDelete = async (c_id) => {
    try {
      const res = await api.delete(`/category/${u_id}/${c_id}/delete`);
      setUserData(res.data.Data);
    } catch (error) {
      console.error("Error in Deletion:", error);
    }
  };

  const [editCatId, setEditCatId] = useState(null);
  const toggleEdit = (catId) => {
    setEditCatId((prev) => (prev === catId ? null : catId));
  };

  const assetsData = buildAssetsDataFromCategory(
    assetsSubCategory,
    currentDate
  );
  const assetsSectionData = buildSubAssetSectionsFromCategories(
    assetsSubCategory.subCategories || [],
    u_id,
    dc_id,
    sc_id,
    handleDelete,
    toggleEdit,
    editCatId,
    navigate
  );
  const holdings = generateHoldings(assetsSubCategory);

  return (
    <>
      <header>
        <Navbar d_btns={d_btns} m_btns={m_btns} path={`/home/${u_id}`} />
        <SubNavbar d_btns={subBtns} />
      </header>
      <main className={homePageStyle.main}>
        <AssetsSection1 data={assetsData} />
        <AssetsSection2 sections={assetsSectionData} />
        <ProductSection holdings={holdings} c_id={assetsSubCategory._id} />
        <AssetsSection3 />
      </main>
      <footer></footer>
    </>
  );
}
