import { H3, H4 } from "../../../singleComponets/heading/heading";
import Image from "../../../singleComponets/image/image";
import section2Style from "./section2.module.css";
import imgStyle from "../../../singleComponets/image/image.module.css";
import btnStyle from "../../../singleComponets/button/button.module.css";
import Button from "../../../singleComponets/button/button";

function AssetsSection2({ sections = [] }) {
  return (
    <div className={section2Style.main}>
      {sections.map((data, index) => (
        <div key={index} className={section2Style.section2}>
          <H3 className={section2Style.head}>
            <Button className={btnStyle.mainbtns} onClick={data.onMainClick}>
              {data.title}
            </Button>
            <Image
              className={imgStyle.subimg}
              src="/assets/medias/images/edit.png"
              alt="Edit"
              onClick={data.onEdit}
            />
            <Image
              className={imgStyle.subimg}
              src="/assets/medias/images/close.png"
              alt="Delete"
              onClick={data.onDelete}
            />
          </H3>

          <div className={section2Style.content}>
            {data.rows?.map((row, i) => (
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
        </div>
      ))}
    </div>
  );
}

export default AssetsSection2;
