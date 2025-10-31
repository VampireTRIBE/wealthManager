import { useNavigate, useParams } from "react-router-dom";
import { H3 } from "../../../../singleComponets/heading/heading";
import Image from "../../../../singleComponets/image/image";
import section2Style from "../section2.module.css";
import imgStyle from "../../../../singleComponets/image/image.module.css";
import btnStyle from "../../../../singleComponets/button/button.module.css";
import Button from "../../../../singleComponets/button/button";
import api from "../../../../../servises/apis/apis";
import { useFormData } from "../../../../../hooks/fromdata";
import { useState } from "react";
import Input from "../../../../singleComponets/input/input";
import inpStyle from "../../../../singleComponets/input/input.module.css";
import { useUser } from "../../../../../hooks/userContext";

export default function S2Head({ Category, handleDelete, u_id }) {
  const params = useParams();
  const navigate = useNavigate();
  const pathParts = Object.values(params).filter(Boolean);
  const currentPath = pathParts.length ? `/${pathParts.join("/")}` : "";
  const { userData, setUserData } = useUser();
  const [isEdit, setisEdit] = useState(false);
  const toggleEdit = () => {
    setisEdit(!isEdit);
  };
  const onMainClick = () => navigate(`/assets${currentPath}/${Category.Name}`);
  const { formData, handleInputChange, resetForm } = useFormData({
    name: "",
    description: "",
  });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/assets/${u_id}/${Category._id}/edit`, {
        newCategory: formData,
      });
      resetForm();
      toggleEdit();
      setUserData(res.data.Data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error. Please try again.");
    }
  };

  return (
    <>
      <H3 className={section2Style.head}>
        <div>
          <Button className={btnStyle.mainbtns} onClick={onMainClick}>
            {Category.Name}
          </Button>
        </div>
        <div>
          <Button className={btnStyle.mainbtns} onClick={onMainClick}>
            Deposit
          </Button>
          <Button className={btnStyle.mainbtns} onClick={onMainClick}>
            Withdrawal
          </Button>
        </div>
        <div>
          <Image
            className={imgStyle.subimg}
            src="/assets/medias/images/plus2.png"
            alt="Add Category"
            onClick={() => {
              handleDelete(Category._id);
            }}
          />
          <Image
            className={imgStyle.subimg}
            src="/assets/medias/images/edit.png"
            alt="Edit"
            onClick={toggleEdit}
          />
          <Image
            className={imgStyle.subimg}
            src="/assets/medias/images/trash.png"
            alt="Delete"
            onClick={() => {
              handleDelete(Category._id);
            }}
          />
        </div>
      </H3>
      <form
        className={`${section2Style.editcatToggle} ${
          isEdit ? section2Style.editcatTogleopen : ""
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
            onClick={toggleEdit}>
            Cancel
          </div>
          <Button
            className={`${btnStyle.snbtns} ${section2Style.fromdatabtn}`}
            type="submit"
            text="Edit"
          />
        </div>
      </form>
    </>
  );
}
