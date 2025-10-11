import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../componets/layoutComponets/navbar/navbar";
import PreLoginHome from "../componets/layoutComponets/main/preLogin/prelogin";
import buttonStyle from "../componets/singleComponets/button/button.module.css";
import useTitle from "../hooks/useTitle";

export default function HomePage() {
  const navigate = useNavigate();
  useTitle("Wealth Manager");
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
              text: "Login",
              className: buttonStyle.mnbtns,
              onClick: () => {
                navigate("/login");
              },
            },
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
        <PreLoginHome />
      </>
      <footer></footer>
    </>
  );
}
