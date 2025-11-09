import { useUser } from "../../hooks/userContext";
import { useParams } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

import AssetsNavbar from "../../componets/layoutComponets/pageSections/assets/SubSections/assetsNavbar";
import AssetsSection1 from "../../componets/layoutComponets/pageSections/assets/section1";
import AssetsSection2 from "../../componets/layoutComponets/pageSections/assets/section2";
import ProductSection from "../../componets/layoutComponets/pageSections/assets/productSection";

import homePageStyle from "./homePage.module.css";

import { HoldingsData } from "../../utills/helpers/assets/assets";
import { useUserCurve } from "../../hooks/userCurveContex";

export default function HomeAssetsSub() {
  const { sc } = useParams();
  useTitle(`Wealth Manager - ${sc}`);
  const { userData, setUserData } = useUser();
  const { userCurveData, setUserCurveData } = useUserCurve();
  
  const assetsCategory = userData.categories.find(
    (cat) => cat.Name === "ASSETS"
  );
  const assetsSubCategory = assetsCategory?.subCategories?.find(
    (cat) => cat.Name === sc
  );

  const assetsCategoryCurve = userCurveData.find(
    (cat) => cat.categoryName === sc
  );

  const holdings = HoldingsData(assetsSubCategory);
  return (
    <>
      <AssetsNavbar categoryName={"ASSETS"} />
      <main className={homePageStyle.main}>
        <AssetsSection1
          categoryDetails={assetsSubCategory}
          topCat={"false"}
          u_id={userData.user._id}
          curveData={assetsCategoryCurve}
        />
        <AssetsSection2
          categoryDetails={assetsSubCategory?.subCategories}
          u_id={userData.user._id}
        />
        <ProductSection
          holdings={holdings}
          u_id={userData.user._id}
          c_id={assetsSubCategory._id}
        />
      </main>
      <footer></footer>
    </>
  );
}
