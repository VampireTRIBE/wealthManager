import { useNavigate } from "react-router-dom";
import Navbar from "../componets/layoutComponets/navbar/navbar";
import useTitle from "../hooks/useTitle";

import buttonStyle from "../componets/singleComponets/button/button.module.css";
import Home from "../componets/layoutComponets/main/home/home";

export default function HomePage() {
  const navigate = useNavigate();
  useTitle("Wealth Manager");
  return (
    <>
      <header>
        <Navbar
          d_btns={[
            {
              dis: 1,
              text: "Login",
              className: buttonStyle.nbutton,
              onClick: () => {
                navigate("/login");
              },
            },
            {
              dis: 2,
              text: "Sign Up",
              className: buttonStyle.nbutton,
              onClick: () => {
                navigate("/signup");
              },
            },
          ]}
          m_btns={[
            {
              dis: 1,
              text: "Login",
              className: buttonStyle.mnbtns,
              onClick: () => {
                navigate("/login");
              },
            },
            {
              dis: 2,
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
        <Home />
      </>
      <footer></footer>
    </>
  );
}
