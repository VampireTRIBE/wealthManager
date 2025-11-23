import { useNavigate } from "react-router-dom";

import Button from "../../../singleComponets/button/button";
import { H1, H3 } from "../../../singleComponets/heading/heading";
import Input from "../../../singleComponets/input/input";
import Label from "../../../singleComponets/label/label";
import Link from "../../../singleComponets/link/link";

import api from "../../../../servises/apis/apis";
import { useFormData } from "../../../../hooks/fromdata";
import { useUser } from "../../../../hooks/userContext";
import { useUserCurve } from "../../../../hooks/userCurveContex";

import loginFromStyle from "./loginForm.module.css";
import btnStyle from "../../../singleComponets/button/button.module.css";
import inputStyle from "../../../singleComponets/input/input.module.css";
import labelStyle from "../../../singleComponets/label/label.module.css";

function LoginFrom({ ...props }) {
  const { setUserData } = useUser();
  const navigate = useNavigate();
  const { setUserCurveData } = useUserCurve();

  const { formData, handleInputChange, resetForm } = useFormData({
    username: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", {
        username: formData.username,
        password: formData.password,
      });
      resetForm();
      setUserData(response?.data?.Data);
      setUserCurveData(response?.data?.CData);
      navigate(`/assets`);
    } catch (err) {
      alert(err?.response?.data?.error);
    }
  };

  return (
    <main className={loginFromStyle.main}>
      <H1 text="Login to Wealth Manager" />
      <form className={loginFromStyle.from} onSubmit={handleSubmit} noValidate>
        <div className={loginFromStyle.cdiv}>
          <Label
            className={labelStyle.primery}
            htmlFor="username"
            text="UserName : "
          />
          <Input
            className={inputStyle.primery}
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={loginFromStyle.cdiv}>
          <Label
            className={labelStyle.primery}
            htmlFor="password"
            text="Password : "
          />
          <Input
            className={inputStyle.primery}
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={loginFromStyle.fbtns}>
          <Link
            className={btnStyle.mainbtns}
            onClick={() => {
              navigate("/");
            }}
            text="Cancel"
          />
          <Button className={btnStyle.mainbtns} type="submit" text="Login" />
        </div>

        <div className={loginFromStyle.fbtns2}>
          <H3 text="Not Registered?" />
          <Link
            className={btnStyle.mainbtns}
            onClick={() => {
              navigate("/signup");
            }}
            text="SingUP"
          />
        </div>
      </form>
    </main>
  );
}

export default LoginFrom;
