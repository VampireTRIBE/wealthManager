import { H1, H3, H4 } from "../../../../singleComponets/heading/heading";
import { useParams } from "react-router-dom";
import section1Style from "../section1.module.css";
import Image from "../../../../singleComponets/image/image";
// import imgStyle from "../../../singleComponets/image/image.module.css";
// import { useState } from "react";
// import { useFormData } from "../../../../hooks/fromdata";
// import section2Style from "./section2.module.css";
// import Input from "../../../singleComponets/input/input";
// import inpStyle from "../../../singleComponets/input/input.module.css";
// import btnStyle from "../../../singleComponets/button/button.module.css";
// import Button from "../../../singleComponets/button/button";
// import { useUser } from "../../../../hooks/userContext";
// import api from "../../../../servises/apis/apis";
// import LiveClock from "../liveClock/liveClock";

function HeadContent() {
   const toggleType=null
  return (
      <div className={section1Style.main}>
        <div className={section1Style.content}>
          {toggleType === null ? (
            <H3>Consolidated Stats</H3>
          ) : (
            <>
              <H3>
                {toggleType.state ? "Consolidated Stats" : "Standalone Stats"}
              </H3>
              <Image
                className={section1Style.toggleType}
                src={
                  toggleType.state
                    ? "/assets/medias/images/toggleon.png"
                    : "/assets/medias/images/toggleoff.png"
                }
                alt="Toggle Type"
                onClick={toggleType.action}
              />
            </>
          )}
        </div>
        {data.content.map((item, i) => (
          <div key={i} className={section1Style.content}>
            <H3 className={section1Style.name}>{item.label}</H3>
            <H4>{item.value}</H4>
          </div>
        ))}
      </div>
  );
}

export default HeadContent;
