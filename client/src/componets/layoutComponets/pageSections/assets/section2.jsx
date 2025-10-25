import { useParams } from "react-router-dom";
import { H3, H4 } from "../../../singleComponets/heading/heading";
import Image from "../../../singleComponets/image/image";
import section2Style from "./section2.module.css";
import imgStyle from "../../../singleComponets/image/image.module.css";
import btnStyle from "../../../singleComponets/button/button.module.css";
import Button from "../../../singleComponets/button/button";
import { useUser } from "../../../../hooks/userContext";
import { useFormData } from "../../../../hooks/fromdata";
import Input from "../../../singleComponets/input/input";
import inpStyle from "../../../singleComponets/input/input.module.css";
import api from "../../../../servises/apis/apis";

function AssetsSection2({ sections = [], u_id }) {
  const paramsLength = Object.keys(useParams()).length;
  const { userData, setUserData } = useUser();
  const { formData, handleInputChange, resetForm } = useFormData({
    name: "",
    description: "",
  });

  const handleDelete = async (c_id) => {
    try {
      const res = await api.delete(`/category/${u_id}/${c_id}/delete`);
      setUserData(res.data.Data);
    } catch (error) {
      console.error("Error in Deletion:", error);
    }
  };

  const handleSubmit = async (e, data) => {
    e.preventDefault();
    try {
      const res = await api.patch(`/category/${u_id}/${data._id}/edit`, {
        newCategory: formData,
      });
      resetForm();
      data.onEdit(data.id);
      setUserData(res.data.Data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Server error. Please try again.");
    }
  };

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
              src="/assets/medias/images/trash.png"
              alt="Delete"
              onClick={()=>{handleDelete(data._id)}}
            />
          </H3>

          <div className={section2Style.content}>
            <form
              className={`${section2Style.editcatToggle} ${
                data.isEditing ? section2Style.editcatTogleopen : ""
              }`}
              onSubmit={(e) => handleSubmit(e, data)}>
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
                  onClick={() => data.onEdit(data.id)}>
                  Cancel
                </div>
                <Button
                  className={`${btnStyle.snbtns} ${section2Style.fromdatabtn}`}
                  type="submit"
                  text="Edit"
                />
              </div>
            </form>

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
