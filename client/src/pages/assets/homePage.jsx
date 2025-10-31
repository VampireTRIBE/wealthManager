import { useUser } from "../../hooks/userContext";

import AssetsNavbar from "../../componets/layoutComponets/pageSections/assets/SubSections/assetsNavbar";
import AssetsSection1 from "../../componets/layoutComponets/pageSections/assets/section1";
import AssetsSection2 from "../../componets/layoutComponets/pageSections/assets/section2";
import AssetsSection3 from "../../componets/layoutComponets/pageSections/assets/section3";

import homePageStyle from "./homePage.module.css";

export default function HomeAssets() {
  const { userData, setUserData } = useUser();

  const assetsCategory = userData.categories.find(
    (cat) => cat.Name === "ASSETS"
  );

  return (
    <>
      <AssetsNavbar categoryName={"ASSETS"} />
      <main className={homePageStyle.main}>
        <AssetsSection1
          categoryDetails={assetsCategory}
          topCat={true}
          u_id={userData.user._id}
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
