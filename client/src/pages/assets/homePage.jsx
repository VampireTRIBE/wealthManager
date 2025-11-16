import { useUser } from "../../hooks/userContext";
import { useUserCurve } from "../../hooks/userCurveContex";
import useTitle from "../../hooks/useTitle";

import AssetsNavbar from "../../componets/layoutComponets/pageSections/assets/SubSections/assetsNavbar";
import AssetsSection1 from "../../componets/layoutComponets/pageSections/assets/section1";
import AssetsSection2 from "../../componets/layoutComponets/pageSections/assets/section2";

import homePageStyle from "./homePage.module.css";

export default function HomeAssets() {
  useTitle(`Wealth Manager - ASSETS`);
  const { userData, setUserData } = useUser();
  const { userCurveData, setUserCurveData } = useUserCurve();

  const assetsCategory = userData.categories.find(
    (cat) => cat.Name === "ASSETS"
  );

  const assetsCategoryCurve = userCurveData.find(
    (cat) => cat.categoryName === "ASSETS"
  );

  return (
    <>
      <AssetsNavbar categoryName={"ASSETS"} />
      <main className={homePageStyle.main}>
        <AssetsSection1
          categoryDetails={assetsCategory}
          topCat={true}
          u_id={userData.user._id}
          curveData={assetsCategoryCurve}
        />
        <AssetsSection2
          categoryDetails={assetsCategory?.subCategories}
          u_id={userData.user._id}
        />
      </main>
      <footer></footer>
    </>
  );
}
