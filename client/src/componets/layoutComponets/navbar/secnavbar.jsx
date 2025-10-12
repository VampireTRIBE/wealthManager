import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import useScroll from "../../../hooks/scroll";
import { useFormData } from "../../../hooks/fromdata";
import { useUser } from "../../../hooks/userContext";

import NavButtons from "./navButtons/navButtons";
import { H3 } from "../../singleComponets/heading/heading";
import Button from "../../singleComponets/button/button";
import Image from "../../singleComponets/image/image";
import Input from "../../singleComponets/input/input";

import subnavbarStyle from "./secnavbar.module.css";
import btnStyle from "../../singleComponets/button/button.module.css";
import imgStyle from "../../singleComponets/image/image.module.css";
import inpStyle from "../../singleComponets/input/input.module.css";
import api from "../../../servises/apis/apis";

function SubNavbar({ d_btns, c_id }) {
  const { id, c } = useParams();
  const { userData, setUserData } = useUser();
  const [addcatToggle, setaddcatToggle] = useState(false);
  const handleAddcatClick = () => setaddcatToggle(!addcatToggle);
  const { formData, handleInputChange, resetForm } = useFormData({
    n_category: "",
  });
  const scrollRef = useScroll("horizontal", 2);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/home/${id}/${c_id}`, {
        name: formData.n_category,
      });
      resetForm();
      setaddcatToggle(false);
      setUserData(res.data.Data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error. Please try again.");
    }
  };

  return (
    <nav className={subnavbarStyle.navbar}>
      <H3
        className={subnavbarStyle.cat}
        style={{ color: "#ffffff", fontSize: "1.3rem", marginRight: "20px" }}
        text="Categories:"
      />
      <div className={subnavbarStyle.nbuttons} ref={scrollRef}>
        <NavButtons btns={d_btns} />
      </div>
      <form
        className={`${subnavbarStyle.addcatToggle} ${
          addcatToggle ? subnavbarStyle.addcatTogleopen : ""
        }`}
        onSubmit={handleSubmit}>
        <Input
          className={inpStyle.primery}
          placeholder="Add category"
          name="n_category"
          value={formData.n_category}
          onChange={handleInputChange}
        />
        <Button className={btnStyle.snbtns} type="submit" text="Add" />
      </form>
      <div className={subnavbarStyle.addcat}>
        <Button
          className={btnStyle.addbtn}
          onClick={handleAddcatClick}
          children={
            <Image
              className={imgStyle.logo}
              src="/assets/medias/images/plus.png"
            />
          }
        />
      </div>
    </nav>
  );
}

export default SubNavbar;
