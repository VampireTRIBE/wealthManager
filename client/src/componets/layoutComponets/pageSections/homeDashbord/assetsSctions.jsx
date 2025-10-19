import { useUser } from "../../../../hooks/userContext";
import { useNavigate } from "react-router-dom";
import Button from "../../../singleComponets/button/button";
import { H1, H3 } from "../../../singleComponets/heading/heading";
import Link from "../../../singleComponets/link/link";
import mainSectionStyle from "./mainSection.module.css";

function AssetsSection({ ...props }) {
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();

  return (
    <div onClick={() => navigate(`/home/${userData.user._id}/${userData.categoryIds.assets}`)} className={mainSectionStyle.mainSection}>
      <div className={mainSectionStyle.info}>
        <H1>Assets</H1>
        <H3
          className={
            userData.financialSummary.assets.xirrPercent < 0
              ? "mainSectionStyle.colororange"
              : "mainSectionStyle.colorgreen"
          }>
          IIR : {userData.financialSummary.assets.xirrPercent} %
        </H3>
      </div>
      <div>
        <div className={mainSectionStyle.info}>
          <H3>Assets Value :</H3>
          <H3
            className={
              userData.financialSummary.assets.totalValue < 0
                ? "mainSectionStyle.colororange"
                : "mainSectionStyle.colorgreen"
            }>
            &#8377; {userData.financialSummary.assets.totalValue}
          </H3>
        </div>
        <div className={mainSectionStyle.info}>
          <H3>Realized Gains :</H3>
          <H3
            className={
              userData.financialSummary.assets.realizedGain < 0
                ? "mainSectionStyle.colororange"
                : "mainSectionStyle.colorgreen"
            }>
            &#8377; {userData.financialSummary.assets.realizedGain}
          </H3>
        </div>
        <div className={mainSectionStyle.info}>
          <H3>UnRealized Gains :</H3>
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
  );
}

export default AssetsSection;
