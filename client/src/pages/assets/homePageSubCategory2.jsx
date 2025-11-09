import { useUser } from "../../hooks/userContext";
import { useParams } from "react-router-dom";
import { useUserCurve } from "../../hooks/userCurveContex";
import useTitle from "../../hooks/useTitle";

import AssetsNavbar from "../../componets/layoutComponets/pageSections/assets/SubSections/assetsNavbar";
import AssetsSection1 from "../../componets/layoutComponets/pageSections/assets/section1";
import AssetsSection2 from "../../componets/layoutComponets/pageSections/assets/section2";
import ProductSection from "../../componets/layoutComponets/pageSections/assets/productSection";

import homePageStyle from "./homePage.module.css";

import { HoldingsData } from "../../utills/helpers/assets/assets";

export default function HomeAssetsSub2() {
  const { sc, ssc } = useParams();
  useTitle(`Wealth Manager - ${ssc}`);
  const { userData, setUserData } = useUser();
  const { userCurveData, setUserCurveData } = useUserCurve();

  const assetsCategory = userData.categories.find(
    (cat) => cat.Name === "ASSETS"
  );
  const assetsSubCategory = assetsCategory?.subCategories?.find(
    (cat) => cat.Name === sc
  );
  const assetsSubCategory2 = assetsSubCategory?.subCategories?.find(
    (cat) => cat.Name === ssc
  );

  const assetsCategoryCurve = userCurveData.find(
    (cat) => cat.categoryName === ssc
  );

  const holdings = HoldingsData(assetsSubCategory2);
  return (
    <>
      <AssetsNavbar categoryName={"ASSETS"} />
      <main className={homePageStyle.main}>
        <AssetsSection1
          categoryDetails={assetsSubCategory2}
          topCat={"false"}
          u_id={userData.user._id}
          curveData={assetsCategoryCurve}
        />
        <AssetsSection2
          categoryDetails={assetsSubCategory2?.subCategories}
          u_id={userData.user._id}
        />
        <ProductSection
          holdings={holdings}
          u_id={userData.user._id}
          c_id={assetsSubCategory2._id}
        />
      </main>
      <footer></footer>
    </>
  );
}
