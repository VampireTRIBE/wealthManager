import { useUser } from "../../hooks/userContext";
import { useParams } from "react-router-dom";

import AssetsNavbar from "../../componets/layoutComponets/pageSections/assets/SubSections/assetsNavbar";
import AssetsSection1 from "../../componets/layoutComponets/pageSections/assets/section1";
import AssetsSection2 from "../../componets/layoutComponets/pageSections/assets/section2";
import AssetsSection3 from "../../componets/layoutComponets/pageSections/assets/section3";

import homePageStyle from "./homePage.module.css";

import { HoldingsData } from "../../utills/helpers/assets/assets";
import ProductSection from "../../componets/layoutComponets/pageSections/assets/productSection";


export default function HomeAssetsSub3() {
  const { sc, ssc, sssc } = useParams();
  const { userData, setUserData } = useUser();

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

  const holdings = HoldingsData(assetsSubCategory3);

  return (
    <>
      <AssetsNavbar categoryName={"ASSETS"} />
      <main className={homePageStyle.main}>
        <AssetsSection1
          categoryDetails={assetsSubCategory3}
          topCat={"false"}
          u_id={userData.user._id}
        />
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
