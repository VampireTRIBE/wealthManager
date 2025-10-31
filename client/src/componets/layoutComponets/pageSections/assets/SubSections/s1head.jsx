import { useState } from "react";
import { useParams } from "react-router-dom";

import { useUser } from "../../../../../hooks/userContext";
import { useFormData } from "../../../../../hooks/fromdata";
import api from "../../../../../servises/apis/apis";

import { H1 } from "../../../../singleComponets/heading/heading";
import Image from "../../../../singleComponets/image/image";
import Input from "../../../../singleComponets/input/input";
import Button from "../../../../singleComponets/button/button";

import section1Style from "../section1.module.css";
import section2Style from "../section2.module.css";
import inpStyle from "../../../../singleComponets/input/input.module.css";
import btnStyle from "../../../../singleComponets/button/button.module.css";
import imgStyle from "../../../../singleComponets/image/image.module.css";

export default function S1Head({ categoryDetails, u_id }) {
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
      const res = await api.post(`/assets/${u_id}/${categoryDetails._id}`, {
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
    <>
      <div className={section1Style.headmain}>
        <H1>{categoryDetails.Name}</H1>
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
    </>
  );
}
