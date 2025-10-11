import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../componets/layoutComponets/navbar/navbar";
import LoginFrom from "../componets/layoutComponets/main/loginForm/loginForm";
import buttonStyle from "../componets/singleComponets/button/button.module.css";
import useTitle from "../hooks/useTitle";

export default function LoginPage() {
  const navigate = useNavigate();
  useTitle("Wealth Manager - Login");
  return (
    <>
      <header>
        <Navbar
          d_btns={[
            {
              text: "Sign Up",
              className: buttonStyle.nbutton,
              onClick: () => {
                navigate("/signup");
              },
            },
          ]}
          m_btns={[
            {
              text: "Sign Up",
              className: buttonStyle.mnbtns,
              onClick: () => {
                navigate("/signup");
              },
            },
          ]}
          path="/"
        />
      </header>
      <>
        <LoginFrom />
      </>
      <footer></footer>
    </>
  );
}
