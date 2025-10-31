import { useState } from "react";

import { H3, H4 } from "../../../../singleComponets/heading/heading";
import Image from "../../../../singleComponets/image/image";

import { AssetsData } from "../../../../../utills/helpers/assets/assets";

import section1Style from "../section1.module.css";

function HeadContent({ categoryDetails, topCat }) {
  const [isConsolidated, setisConsolidated] = useState(false);
  const ChangeConsolidated = () => {
    setisConsolidated(!isConsolidated);
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
          <H4>{item.value}</H4>
        </div>
      ))}
    </div>
  );
}

export default HeadContent;
