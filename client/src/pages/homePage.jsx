import { useNavigate } from "react-router-dom";
import useTitle from "../hooks/useTitle";

import Navbar from "../componets/layoutComponets/navbar/navbar";
import HomeBlogin from "../componets/layoutComponets/home/homeBlogin";

import buttonStyle from "../componets/singleComponets/button/button.module.css";

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
              className: buttonStyle.dnbutton,
              onClick: () => {
                navigate("/login");
              },
            },
            {
              dis: 2,
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
        <HomeBlogin />
      </>
      <footer></footer>
    </>
  );
}
