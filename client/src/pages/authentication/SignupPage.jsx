import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import SingupFrom from "../../componets/layoutComponets/main/authentication/signupFrom/signupForm";

import buttonStyle from "../../componets/singleComponets/button/button.module.css";

export default function SingupPage() {
  const navigate = useNavigate();
  useTitle("Wealth Manager - SignUp")
  return (
    <>
      <header>
        <Navbar
          d_btns={[
            {
              text: "Login",
              className: buttonStyle.nbutton,
              onClick: () => {
                navigate("/login");
              },
            },
          ]}
          m_btns={[
            {
              text: "Login",
              className: buttonStyle.mnbtns,
              onClick: () => {
                navigate("/login");
              },
            },
          ]}
          path="/"
        />
      </header>
      <>
        <SingupFrom />
      </>
      <footer></footer>
    </>
  );
}
