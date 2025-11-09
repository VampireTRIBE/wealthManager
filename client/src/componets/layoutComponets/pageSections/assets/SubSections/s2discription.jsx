import { useState } from "react";
import { useUserCurve } from "../../../../../hooks/userCurveContex";
import api from "../../../../../servises/apis/apis";

import { H3, H4 } from "../../../../singleComponets/heading/heading";
import Image from "../../../../singleComponets/image/image";
import Button from "../../../../singleComponets/button/button";
import S2CurveGraph from "./s2curve";

import section2Style from "../section2.module.css";
import btnStyle from "../../../../singleComponets/button/button.module.css";
import { S2DiscriptionData } from "../../../../../utills/helpers/assets/assets";

export default function S2Discription({ CategoryData, u_id }) {
  const { userCurveData, setUserCurveData } = useUserCurve();
  const [isConsolidated, setisConsolidated] = useState(false);
  const [irrView, setirrView] = useState(false);
  const [irrValue, setIrrValue] = useState(null);
  const ChangeConsolidated = () => {
    setisConsolidated(!isConsolidated);
    setirrView(false);
  };

  const changeIrrView = async (type) => {
    try {
      const res = await api.get(`/assets/irr/${u_id}/${CategoryData._id}/${type}`);
      console.log(res)
      setIrrValue(res?.data?.irr ?? 0);
    } catch (error) {
      console.error("Failed to fetch IRR:", error);
    }
    setirrView(true);
  };

  const type = isConsolidated ? "consolidated" : "standalone";
  const ContentDiscription = S2DiscriptionData(CategoryData, type);
  const curveData = userCurveData.find(
    (catCurve) => catCurve.categoryName === CategoryData.Name
  );
  return (
    <div className={section2Style.content}>
      <div className={section2Style.contentSUB}>
        <div className={section2Style.toggleDiv}>
          <H3>{isConsolidated ? "Consolidated Stats" : "Standalone Stats"}</H3>
          <Image
            className={section2Style.toggleType}
            src={
              isConsolidated
                ? "/assets/medias/images/toggleon.png"
                : "/assets/medias/images/toggleoff.png"
            }
            alt="Toggle Type"
            onClick={ChangeConsolidated}
          />
        </div>
        {ContentDiscription.rows?.map((row, i) => (
          <div key={i} className={section2Style.info}>
            {row.map((item, j) => (
              <div key={j} className={section2Style.info_detail}>
                <H4>{item.label}</H4>
                <H4>
                  {i === ContentDiscription.rows.length - 1 ? (
                    irrView ? (
                      `${irrValue.toFixed(2)} %`
                    ) : (
                      <Button
                        className={btnStyle.buy}
                        onClick={() => changeIrrView(type)}>
                        View
                      </Button>
                    )
                  ) : (
                    `${Number(item.value).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })} Rs`
                  )}
                </H4>
              </div>
            ))}
          </div>
        ))}
      </div>
      <S2CurveGraph categoryData={curveData} />
      <S2CurveGraph categoryData={curveData} flag={2} />
      <S2CurveGraph categoryData={curveData} flag={3} />
    </div>
  );
}
