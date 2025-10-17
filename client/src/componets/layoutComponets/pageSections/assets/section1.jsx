import { H1, H3, H4 } from "../../../singleComponets/heading/heading";

import section1Style from "./section1.module.css";

function AssetsSection1({ data }) {
  return (
    <div className={section1Style.section1}>
      <div className={section1Style.head}>
        <H1>{data.title}</H1>
        <H3>{data.date}</H3>
      </div>
      <div className={section1Style.main}>
        {data.content.map((item, i) => (
          <div key={i} className={section1Style.content}>
            <H3 className={section1Style.name}>{item.label}</H3>
            <H4>{item.value}</H4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AssetsSection1;
