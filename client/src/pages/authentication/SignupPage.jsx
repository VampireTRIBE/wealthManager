import { useNavigate } from "react-router-dom";
import useTitle from "../../hooks/useTitle";
import { AutoFieldsProvider } from "../../hooks/useAutoFields";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import SingupFrom from "../../componets/layoutComponets/authentication/signupFrom/signupForm";

import buttonStyle from "../../componets/singleComponets/button/button.module.css";

export default function SingupPage() {
  const navigate = useNavigate();
  useTitle("Wealth Manager - SignUp");
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
          ]}
          path="/"
        />
      </header>
      <>
        <AutoFieldsProvider>
          <SingupFrom />
        </AutoFieldsProvider>
      </>
      <footer></footer>
    </>
  );
}
