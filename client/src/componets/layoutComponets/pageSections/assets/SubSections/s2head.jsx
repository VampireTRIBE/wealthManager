import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useUser } from "../../../../../hooks/userContext";
import { useFormData } from "../../../../../hooks/fromdata";
import api from "../../../../../servises/apis/apis";

import { H3 } from "../../../../singleComponets/heading/heading";
import Image from "../../../../singleComponets/image/image";
import Button from "../../../../singleComponets/button/button";

import section2Style from "../section2.module.css";
import imgStyle from "../../../../singleComponets/image/image.module.css";
import btnStyle from "../../../../singleComponets/button/button.module.css";
import Input from "../../../../singleComponets/input/input";
import inpStyle from "../../../../singleComponets/input/input.module.css";

export default function S2Head({ Category, handleDelete, u_id }) {
  const params = useParams();
  const navigate = useNavigate();
  const pathParts = Object.values(params).filter(Boolean);
  const currentPath = pathParts.length ? `/${pathParts.join("/")}` : "";
  const { userData, setUserData } = useUser();

  const onMainClick = () => navigate(`/assets${currentPath}/${Category.Name}`);

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
      if (fromType === "deposit") {
        formSubmitData = { statement: depositFromData };
        url = `/assets/statement/${u_id}/${Category._id}/deposit`;
      } else if (fromType === "withdrawal") {
        formSubmitData = { statement: WithdrawalFromData };
        url = `/assets/statement/${u_id}/${Category._id}/withdrawal`;
      } else if (fromType === "addCat") {
        formSubmitData = { newCategory: formData };
        url = `/assets/${u_id}/${Category._id}`;
      } else if (fromType === "editCat") {
        formSubmitData = { newCategory: editCatFromData };
        url = `/assets/${u_id}/${Category._id}/edit`;
        Method = "patch";
      } else {
        throw new Error("Unknown form type");
      }
      const res = await api[Method](url, formSubmitData);

      if (fromType === "deposit") {
        setdepositFromData({ categoryName: Category.Name });
      } else if (fromType === "withdrawal") {
        setWithdrawalFromData({ categoryName: Category.Name });
      } else if (fromType === "addCat") {
        resetForm();
      } else if (fromType === "editCat") {
        seteditCatFromData({ name: Category.Name });
      }
      setaddCat(false);
      setdeposit(false);
      setwithdrawal(false);
      seteditCat(false);
      setUserData(res.data.Data);
    } catch (err) {
      console.error(err);
    }
  };

  const [depositFromData, setdepositFromData] = useState({
    categoryName: Category.Name,
  });

  const handleDepositChange = (e) => {
    const { name, value } = e.target;
    setdepositFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [WithdrawalFromData, setWithdrawalFromData] = useState({
    categoryName: Category.Name,
  });

  const handleWithdrawalChange = (e) => {
    const { name, value } = e.target;
    setWithdrawalFromData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [editCatFromData, seteditCatFromData] = useState({
    name: Category.Name,
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
      <H3 className={section2Style.head}>
        <div>
          <Button className={btnStyle.mainbtns} onClick={onMainClick}>
            {Category.Name}
          </Button>
        </div>
        <div className={section2Style.headDiv}>
          <div className={section2Style.headDivSub}>
            <Button className={btnStyle.buy} onClick={toggledeposit}>
              Deposit
            </Button>
            <Button className={btnStyle.sell} onClick={toggleWithdrawal}>
              Withdrawal
            </Button>
          </div>
          <div>
            <Image
              className={imgStyle.subimg}
              src="/assets/medias/images/plus2.png"
              alt="Add New Category"
              title="Add New Category"
              onClick={toggleAddCat}
            />
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
                handleDelete(Category._id);
              }}
            />
          </div>
        </div>
      </H3>
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
