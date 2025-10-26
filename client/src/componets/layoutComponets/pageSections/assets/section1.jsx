import { H1, H3, H4 } from "../../../singleComponets/heading/heading";
import { useParams } from "react-router-dom";
import section1Style from "./section1.module.css";
import Image from "../../../singleComponets/image/image";
import imgStyle from "../../../singleComponets/image/image.module.css";
import { useState } from "react";
import { useFormData } from "../../../../hooks/fromdata";
import section2Style from "./section2.module.css";
import Input from "../../../singleComponets/input/input";
import inpStyle from "../../../singleComponets/input/input.module.css";
import btnStyle from "../../../singleComponets/button/button.module.css";
import Button from "../../../singleComponets/button/button";
import { useUser } from "../../../../hooks/userContext";
import api from "../../../../servises/apis/apis";
import LiveClock from "../liveClock/liveClock";

function AssetsSection1({ data, u_id, id }) {
  const paramsLength = Object.keys(useParams()).length;
  const { userData, setUserData } = useUser();

  const [addCat, setaddCat] = useState(false);
  const toggleAddCat = () => {
    setaddCat(!addCat);
  };

  const { formData, handleInputChange, resetForm } = useFormData({
    name: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/assets/${u_id}/${id}`, {
        newCategory: formData,
      });
      resetForm();
      setaddCat(false);
      setUserData(res.data.Data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={section1Style.section1}>
      <div className={section1Style.head}>
        <div className={section1Style.headmain}>
          <H1>{data.title}</H1>
          {paramsLength == 3 ? (
            ""
          ) : paramsLength >= 1 ? (
            <Image
              className={`${imgStyle.subimg} ${section1Style.addicon}`}
              src="/assets/medias/images/plus2.png"
              alt="Add Category"
              onClick={toggleAddCat}
            />
          ) : (
            ""
          )}
        </div>
        <form
          className={`${section2Style.editcatToggle} ${
            addCat ? section2Style.editcatTogleopen : ""
          }`}
          onSubmit={(e) => handleSubmit(e)}>
          <Input
            className={`${inpStyle.primery}`}
            placeholder="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          <Input
            className={`${inpStyle.primery}`}
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
          <div className={`${section2Style.frombtndiv}`}>
            <div
              className={`${btnStyle.snbtns} ${section2Style.fromdatabtn}`}
              onClick={() => setaddCat(false)}>
              Cancel
            </div>
            <Button
              className={`${btnStyle.snbtns} ${section2Style.fromdatabtn}`}
              type="submit"
              text="Add"
            />
          </div>
        </form>
        <LiveClock/>
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
