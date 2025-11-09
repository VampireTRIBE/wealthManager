import { useNavigate } from "react-router-dom";

import { H1 } from "../../singleComponets/heading/heading";
import NavButtons from "../navbar/navButtons/navButtons";

import homeStyle from "./homeBlogin.module.css";
import headingStyle from "../../singleComponets/heading/heading.module.css";
import buttonStyle from "../../singleComponets/button/button.module.css";

function HomeBlogin({ ...props }) {
  const navigate = useNavigate();
  return (
    <main className={homeStyle.main}>
      <H1 className={headingStyle.title} text="Welcome to Wealth Manager" />
      <div className={homeStyle.authbtns}>
        <NavButtons
          btns={[
            {
              text: "Login",
              className: buttonStyle.mainbtns,
              onClick: () => {
                navigate("/login");
              },
            },
            {
              text: "Sign Up",
              className: buttonStyle.mainbtns,
              onClick: () => {
                navigate("/signup");
              },
            },
          ]}
        />
      </div>
    </main>
  );
}

export default HomeBlogin;
