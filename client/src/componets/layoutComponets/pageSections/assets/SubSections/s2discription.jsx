import { useState } from "react";

import { H3, H4 } from "../../../../singleComponets/heading/heading";
import Image from "../../../../singleComponets/image/image";

import section2Style from "../section2.module.css";

import { S2DiscriptionData } from "../../../../../utills/helpers/assets/assets";

export default function S2Discription({ CategoryData }) {
  const [isConsolidated, setisConsolidated] = useState(false);
  const ChangeConsolidated = () => {
    setisConsolidated(!isConsolidated);
  };
  const type = isConsolidated ? "consolidated" : "standalone";
  const ContentDiscription = S2DiscriptionData(CategoryData, type);
  return (
    <div className={section2Style.content}>
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
              <H4>{item.value}</H4>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
