import { useNavigate } from "react-router-dom";

import api from "../../../../servises/apis/apis";
import { useFormData } from "../../../../hooks/fromdata";
import { useUser } from "../../../../hooks/userContext";

import Button from "../../../singleComponets/button/button";
import { H1, H3 } from "../../../singleComponets/heading/heading";
import Input from "../../../singleComponets/input/input";
import Label from "../../../singleComponets/label/label";
import Link from "../../../singleComponets/link/link";

import singupFromStyle from "./signupForm.module.css";
import btnStyle from "../../../singleComponets/button/button.module.css";
import inputStyle from "../../../singleComponets/input/input.module.css";
import labelStyle from "../../../singleComponets/label/label.module.css";

function SingupFrom({ ...props }) {
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();

  const { formData, handleInputChange, resetForm } = useFormData({
    newUser: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
    },
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/signup", {
        newUser: formData.newUser,
        password: formData.password,
      });
      resetForm();
      setUserData(response.data.Data);
      navigate(`/assets`);
    } catch (err) {
      
    }
  };
  return (
    <main className={singupFromStyle.main}>
      <H1 text="SignUP to Wealth Manager" />
      <form className={singupFromStyle.from} onSubmit={handleSubmit} noValidate>
        <div className={singupFromStyle.cdiv}>
          <div className={singupFromStyle.cdivsub}>
            <Label
              className={labelStyle.primerynext}
              htmlFor="fname"
              text="First Name : "
            />
            <Input
              className={inputStyle.primery}
              type="text"
              name="newUser.firstName"
              id="fname"
              value={formData.newUser.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={singupFromStyle.cdivsub}>
            <Label
              className={labelStyle.primerynext}
              htmlFor="lname"
              text="Last Name : "
            />
            <Input
              className={inputStyle.primery}
              type="text"
              name="newUser.lastName"
              id="lname"
              value={formData.newUser.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className={singupFromStyle.cdivsub}>
          <Label
            className={labelStyle.primery}
            htmlFor="email"
            text="Email : "
          />
          <Input
            className={inputStyle.primery}
            type="email"
            name="newUser.email"
            id="email"
            value={formData.newUser.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className={singupFromStyle.cdiv}>
          <div className={singupFromStyle.cdivsub}>
            <Label
              className={labelStyle.primerynext}
              htmlFor="username"
              text="UserName : "
            />
            <Input
              className={inputStyle.primery}
              type="text"
              id="username"
              name="newUser.username"
              value={formData.newUser.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={singupFromStyle.cdivsub}>
            <Label
              className={labelStyle.primerynext}
              htmlFor="password"
              text="Password : "
            />
            <Input
              className={inputStyle.primery}
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className={singupFromStyle.fbtns}>
          <Link
            className={btnStyle.mainbtns}
            onClick={() => {
              navigate("/");
            }}
            text="Cancel"
          />
          <Button className={btnStyle.mainbtns} type="submit" text="SignUP" />
        </div>

        <div className={singupFromStyle.fbtns2}>
          <H3 text="Have Account?" />
          <Link
            className={btnStyle.mainbtns}
            onClick={() => {
              navigate("/login");
            }}
            text="Login"
          />
        </div>
      </form>
    </main>
  );
}

export default SingupFrom;
