import { useUser } from "../../../../hooks/userContext";
import api from "../../../../servises/apis/apis";

import S2Head from "./SubSections/s2head";
import S2Discription from "./SubSections/s2discription";

import section2Style from "./section2.module.css";

function AssetsSection2({ u_id, categoryDetails }) {
  const { userData, setUserData } = useUser();
  const handleDelete = async (c_id) => {
    try {
      const res = await api.delete(`/assets/${u_id}/${c_id}/delete`);
      console.log(res);
      setUserData(res.data.Data);
    } catch (error) {
      console.error("Error in Deletion:", error);
    }
  };

  return (
    <div className={section2Style.main}>
      {categoryDetails.map((cat, index) => (
        <div key={index} className={section2Style.section2}>
          <S2Head Category={cat} handleDelete={handleDelete} u_id={u_id} />
          <S2Discription CategoryData={cat} u_id={u_id} />
        </div>
      ))}
    </div>
  );
}

export default AssetsSection2;
