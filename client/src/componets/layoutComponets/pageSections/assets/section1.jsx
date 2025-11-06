import LiveClock from "../liveClock/liveClock";
import HeadContent from "./SubSections/s1headDiscription";
import S1Head from "./SubSections/s1head";
import section1Style from "./section1.module.css";
import { useUser } from "../../../../hooks/userContext";
import api from "../../../../servises/apis/apis";
import { useLocation, useNavigate } from "react-router-dom";
import CurveGraph from "./SubSections/curve";

function AssetsSection1({ categoryDetails, topCat, u_id, curveData }) {
  const navigate = useNavigate();
  const c_url = useLocation();
  const { userData, setUserData } = useUser();
  const removeLastParam = () => {
    const pathParts = c_url.pathname.split("/");
    pathParts.pop();
    const newPath = pathParts.join("/") || "/";
    navigate(newPath);
  };
  const handleDelete = async (c_id) => {
    try {
      const res = await api.delete(`/assets/${u_id}/${c_id}/delete`);
      setUserData(res.data.Data);
      removeLastParam();
    } catch (error) {
      console.error("Error in Deletion:", error);
    }
  };
  return (
    <div className={section1Style.section1}>
      <div className={section1Style.head}>
        <S1Head
          categoryDetails={categoryDetails}
          handleDelete={handleDelete}
          u_id={u_id}
        />
        <div className={section1Style.headSub}>
          <LiveClock />
          <CurveGraph categoryData={curveData}/>
        </div>
      </div>
      <HeadContent categoryDetails={categoryDetails} topCat={topCat} />
    </div>
  );
}

export default AssetsSection1;
