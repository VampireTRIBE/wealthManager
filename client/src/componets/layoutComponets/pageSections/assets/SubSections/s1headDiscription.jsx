import { useState } from "react";
import api from "../../../../../servises/apis/apis";

import { H3, H4 } from "../../../../singleComponets/heading/heading";
import Button from "../../../../singleComponets/button/button";
import Image from "../../../../singleComponets/image/image";

import section1Style from "../section1.module.css";
import btnStyle from "../../../../singleComponets/button/button.module.css";

import { AssetsData } from "../../../../../utills/helpers/assets/assets";

function HeadContent({ categoryDetails, topCat, u_id }) {
  const [isConsolidated, setisConsolidated] = useState(false);
  const [irrView, setirrView] = useState(false);
  const [irrValue, setIrrValue] = useState(null);
  const ChangeConsolidated = () => {
    setisConsolidated(!isConsolidated);
    setirrView(false);
  };

  const changeIrrView = async (type) => {
    try {
      const res = await api.get(
        `/assets/irr/${u_id}/${categoryDetails._id}/${type}`
      );
      setIrrValue(res?.data?.irr ?? 0);
    } catch (error) {
      console.error("Failed to fetch IRR:", error);
    }
    setirrView(true);
  };

  const type =
    topCat === true
      ? "consolidated"
      : isConsolidated
      ? "consolidated"
      : "standalone";

  const CategoryContent = AssetsData(categoryDetails, type);
  return (
    <div className={section1Style.main}>
      <div className={section1Style.content}>
        {topCat === true ? (
          <H3>Consolidated Stats</H3>
        ) : (
          <>
            <H3>
              {isConsolidated ? "Consolidated Stats" : "Standalone Stats"}
            </H3>
            <Image
              className={section1Style.toggleType}
              src={
                isConsolidated
                  ? "/assets/medias/images/toggleon.png"
                  : "/assets/medias/images/toggleoff.png"
              }
              alt="Toggle Type"
              onClick={ChangeConsolidated}
            />
          </>
        )}
      </div>
      {CategoryContent.content.map((item, i) => (
        <div key={i} className={section1Style.content}>
          <H3 className={section1Style.name}>{item.label}</H3>
          <H4>
            {i == CategoryContent.content.length - 1 ? (
              topCat === true ? (
                item.value
              ) : irrView ? (
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
  );
}

export default HeadContent;
