import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../componets/layoutComponets/navbar/navbar";
import SingupFrom from "../componets/layoutComponets/main/signupFrom/signupForm";
import buttonStyle from "../componets/singleComponets/button/button.module.css";
export default function SingupPage() {
  const navigate = useNavigate();
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
