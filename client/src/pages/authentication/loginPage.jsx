import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import LoginFrom from "../../componets/layoutComponets/authentication/loginForm/loginForm";

import buttonStyle from "../../componets/singleComponets/button/button.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  useTitle("Wealth Manager - Login");
  return (
    <>
      <header>
        <Navbar
          d_btns={[
            {
              dis: 1,
              text: "Sign Up",
              className: buttonStyle.dnbutton,
              onClick: () => {
                navigate("/signup");
              },
            },
          ]}
          m_btns={[
            {
              dis: 1,
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
