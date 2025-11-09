import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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

export default function S1Head({ categoryDetails, u_id, handleDelete }) {
  const paramsLength = Object.keys(useParams()).length;
  const navigate = useNavigate();
  const c_url = useLocation();
  const { userData, setUserData } = useUser();

  const removeLastParam = () => {
    const pathParts = c_url.pathname.split("/");
    pathParts.pop();
    const newPath = pathParts.join("/") || "/";
    return newPath;
  };

  const [addCat, setaddCat] = useState(false);
  const [deposit, setdeposit] = useState(false);
  const [Withdrawal, setwithdrawal] = useState(false);
  const [editCat, seteditCat] = useState(false);

  const toggleAddCat = () => {
    setaddCat((prev) => {
      const newState = !prev;
      if (newState) {
        setdeposit(false);
        setwithdrawal(false);
        seteditCat(false);
      }
      return newState;
    });
  };

  const toggledeposit = () => {
    setdeposit((prev) => {
      const newState = !prev;
      if (newState) {
        setaddCat(false);
        setwithdrawal(false);
        seteditCat(false);
      }
      return newState;
    });
  };

  const toggleWithdrawal = () => {
    setwithdrawal((prev) => {
      const newState = !prev;
      if (newState) {
        setaddCat(false);
        setdeposit(false);
        seteditCat(false);
      }
      return newState;
    });
  };

  const toggleeditCat = () => {
    seteditCat((prev) => {
      const newState = !prev;
      if (newState) {
        setaddCat(false);
        setdeposit(false);
        setwithdrawal(false);
      }
      return newState;
    });
  };

  const { formData, handleInputChange, resetForm } = useFormData({
    name: "",
    description: "",
  });

  const handleSubmit = async (e, fromType) => {
    e.preventDefault();
    try {
      let formSubmitData;
      let url;
      let Method = "post";
      let NewName;
      if (fromType === "deposit") {
        formSubmitData = { statement: depositFromData };
        url = `/assets/statement/${u_id}/${categoryDetails._id}/deposit`;
      } else if (fromType === "withdrawal") {
        formSubmitData = { statement: WithdrawalFromData };
        url = `/assets/statement/${u_id}/${categoryDetails._id}/withdrawal`;
      } else if (fromType === "addCat") {
        formSubmitData = { newCategory: formData };
        url = `/assets/${u_id}/${categoryDetails._id}`;
      } else if (fromType === "editCat") {
        NewName = editCatFromData.name;
        formSubmitData = { newCategory: editCatFromData };
        url = `/assets/${u_id}/${categoryDetails._id}/edit`;
        Method = "patch";
      } else {
        throw new Error("Unknown form type");
      }
      const res = await api[Method](url, formSubmitData);

      if (fromType === "deposit") {
        setdepositFromData({ categoryName: categoryDetails.Name });
      } else if (fromType === "withdrawal") {
        setWithdrawalFromData({ categoryName: categoryDetails.Name });
      } else if (fromType === "addCat") {
        resetForm();
      } else if (fromType === "editCat") {
        seteditCatFromData({ categoryName: categoryDetails.Name });
      }
      setaddCat(false);
      setdeposit(false);
      setwithdrawal(false);
      seteditCat(false);
      setUserData(res.data.Data);
      if (fromType === "editCat") {
        const new_url = removeLastParam();
        navigate(`${new_url}/${NewName}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const [depositFromData, setdepositFromData] = useState({
    categoryName: categoryDetails.Name,
  });

  const handleDepositChange = (e) => {
    const { name, value } = e.target;
    setdepositFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [WithdrawalFromData, setWithdrawalFromData] = useState({
    categoryName: categoryDetails.Name,
  });

  const handleWithdrawalChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [editCatFromData, seteditCatFromData] = useState({
    name: categoryDetails.Name,
  });

  const handleeditCatChange = (e) => {
    const { name, value } = e.target;
    seteditCatFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className={section1Style.headmain}>
        <H1>{categoryDetails.Name}</H1>
        {paramsLength >= 1 ? (
          <div className={section1Style.headDiv}>
            <div className={section1Style.headDivSub}>
              <Button className={btnStyle.buy} onClick={toggledeposit}>
                Deposit
              </Button>
              <Button className={btnStyle.sell} onClick={toggleWithdrawal}>
                Withdrawal
              </Button>
            </div>
            <div>
              {paramsLength != 3 ? (
                <Image
                  className={imgStyle.subimg}
                  src="/assets/medias/images/plus2.png"
                  alt="Add Category"
                  title="ADD New Category"
                  onClick={toggleAddCat}
                />
              ) : (
                ""
              )}

              <Image
                className={imgStyle.subimg}
                src="/assets/medias/images/edit.png"
                alt="Edit"
                title="Edit Category"
                onClick={toggleeditCat}
              />
              <Image
                className={imgStyle.subimg}
                src="/assets/medias/images/trash.png"
                alt="Delete"
                title="Delete Category"
                onClick={() => {
                  handleDelete(categoryDetails._id);
                }}
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <form
        className={`${section2Style.editcatToggle} ${
          addCat ? section2Style.editcatTogleopen : ""
        }`}
        onSubmit={(e) => handleSubmit(e, "addCat")}>
        <Input
          className={`${inpStyle.primery}`}
          placeholder="Category name"
          name="name"
          value={formData.name || ""}
          onChange={handleInputChange}
        />
        <Input
          className={`${inpStyle.primery}`}
          placeholder="Description"
          name="description"
          value={formData.description || ""}
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

      <form
        className={`${section2Style.editcatToggle} ${
          deposit ? section2Style.editcatTogleopen : ""
        }`}
        onSubmit={(e) => handleSubmit(e, "deposit")}>
        <Input
          className={`${inpStyle.primery}`}
          name="categoryName"
          value={depositFromData.categoryName || ""}
          onChange={handleDepositChange}
          readOnly
        />
        <Input
          className={`${inpStyle.primery}`}
          type="Number"
          placeholder="amount"
          name="amount"
          value={depositFromData.amount || 0}
          onChange={handleDepositChange}
        />
        <Input
          className={`${inpStyle.primery}`}
          type="date"
          placeholder="date"
          name="date"
          value={
            depositFromData.date ||
            new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .split("T")[0]
          }
          onChange={handleDepositChange}
        />
        <div className={`${section2Style.frombtndiv}`}>
          <div
            className={`${btnStyle.snbtns} ${section2Style.fromdatabtn}`}
            onClick={() => toggledeposit(false)}>
            Cancel
          </div>
          <Button
            className={`${btnStyle.buy} ${section2Style.fromdatabtn}`}
            type="submit"
            text="Deposit"
          />
        </div>
      </form>

      <form
        className={`${section2Style.editcatToggle} ${
          Withdrawal ? section2Style.editcatTogleopen : ""
        }`}
        onSubmit={(e) => handleSubmit(e, "withdrawal")}>
        <Input
          className={`${inpStyle.primery}`}
          name="categoryName"
          value={WithdrawalFromData.categoryName || ""}
          onChange={handleWithdrawalChange}
          readOnly
        />
        <Input
          className={`${inpStyle.primery}`}
          type="Number"
          placeholder="amount"
          name="amount"
          value={WithdrawalFromData.amount || 0}
          onChange={handleWithdrawalChange}
        />
        <Input
          className={`${inpStyle.primery}`}
          type="date"
          placeholder="date"
          name="date"
          value={
            WithdrawalFromData.date ||
            new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
              .toISOString()
              .split("T")[0]
          }
          onChange={handleWithdrawalChange}
        />
        <div className={`${section2Style.frombtndiv}`}>
          <div
            className={`${btnStyle.snbtns} ${section2Style.fromdatabtn}`}
            onClick={() => toggleWithdrawal(false)}>
            Cancel
          </div>
          <Button
            className={`${btnStyle.sell} ${section2Style.fromdatabtn}`}
            type="submit"
            text="Withdrawal"
          />
        </div>
      </form>

      <form
        className={`${section2Style.editcatToggle} ${
          editCat ? section2Style.editcatTogleopen : ""
        }`}
        onSubmit={(e) => handleSubmit(e, "editCat")}>
        <Input
          className={`${inpStyle.primery}`}
          name="name"
          value={editCatFromData.name || ""}
          onChange={handleeditCatChange}
        />
        <Input
          className={`${inpStyle.primery}`}
          placeholder="Description"
          name="description"
          value={editCatFromData.description || ""}
          onChange={handleeditCatChange}
        />
        <div className={`${section2Style.frombtndiv}`}>
          <div
            className={`${btnStyle.snbtns} ${section2Style.fromdatabtn}`}
            onClick={() => toggleeditCat(false)}>
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
