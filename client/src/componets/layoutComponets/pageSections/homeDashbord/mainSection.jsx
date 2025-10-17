import { useUser } from "../../../../hooks/userContext";
import { H1, H3 } from "../../../singleComponets/heading/heading";
import mainSectionStyle from "./mainSection.module.css";

function MainSection({ ...props }) {
  const { userData, setUserData } = useUser();

  return (
    <div className={mainSectionStyle.mainSection}>
      <H1>Welcome {userData.user.firstName}</H1>
      <div>
        <H3>Last 2 Years : </H3>
        <div>
          <div className={mainSectionStyle.info}>
            <H3>→ Income : </H3>
            <H3
              className={
                userData.financialSummary.assets.totalValue < 0
                  ? "mainSectionStyle.colororange"
                  : "mainSectionStyle.colorgreen"
              }>
              &#8377; {userData.financialSummary.lastTwoYearsIncome}
            </H3>
          </div>
          <div className={mainSectionStyle.info}>
            <H3 className={mainSectionStyle.info}>→ Expenses :</H3>
            <H3
              className={
                userData.financialSummary.assets.totalValue < 0
                  ? "mainSectionStyle.colororange"
                  : "mainSectionStyle.colorgreen"
              }>
              &#8377; {userData.financialSummary.lastTwoYearsExpenses}
            </H3>
          </div>
          <div className={mainSectionStyle.info}>
            <H3 className={mainSectionStyle.info}>Total Assets Value :</H3>
            <H3
              className={
                userData.financialSummary.assets.totalValue < 0
                  ? "mainSectionStyle.colororange"
                  : "mainSectionStyle.colorgreen"
              }>
              &#8377; {userData.financialSummary.assets.totalValue}
            </H3>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainSection;
