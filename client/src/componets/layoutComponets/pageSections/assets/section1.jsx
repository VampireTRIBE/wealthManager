import LiveClock from "../liveClock/liveClock";
import HeadContent from "./SubSections/s1headDiscription";
import S1Head from "./SubSections/s1head";
import section1Style from "./section1.module.css";

function AssetsSection1({ categoryDetails, topCat, u_id }) {
  return (
    <div className={section1Style.section1}>
      <div className={section1Style.head}>
        <S1Head categoryDetails={categoryDetails} u_id={u_id}/>
        <LiveClock />
      </div>
      <HeadContent categoryDetails={categoryDetails} topCat={topCat} />
    </div>
  );
}

export default AssetsSection1;
