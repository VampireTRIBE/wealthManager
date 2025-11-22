import { useParams } from "react-router-dom";
import { useUserCurve } from "../../hooks/userCurveContex";
import useTitle from "../../hooks/useTitle";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import S2CurveGraph from "../../componets/layoutComponets/pageSections/assets/SubSections/s2curve";

export default function ChartsPage() {
  const { name, flag } = useParams();
  useTitle(`Wealth Manager - Charts`);
  const { userCurveData, setUserCurveData } = useUserCurve();

  const CurveData = userCurveData.find((cat) => cat.categoryName === name);
  return (
    <>
      <header>
        <Navbar d_btns={[]} m_btns={[]} path="" />
      </header>
      <main>
        <S2CurveGraph
          categoryData={CurveData}
          flag={flag}
          isFullScreen={"true"}
        />
      </main>
      <footer></footer>
    </>
  );
}
