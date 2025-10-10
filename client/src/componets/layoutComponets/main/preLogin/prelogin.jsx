import { useNavigate } from "react-router-dom";
import { H1 } from "../../../singleComponets/heading/heading";
import preLoginStyle from "./prelogin.module.css";
import headingStyle from "../../../singleComponets/heading/heading.module.css";
import buttonStyle from "../../../singleComponets/button/button.module.css";
import NavButtons from "../../navbar/navButtons/navButtons";

function PreLoginHome({ ...props }) {
  const navigate = useNavigate();
  return (
    <main className={preLoginStyle.main}>
      <H1 className={headingStyle.title} text="Welcome to Wealth Manager" />
      <div className={preLoginStyle.authbtns}>
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
                navigate("/login");
              },
            },
          ]}
        />
      </div>
    </main>
  );
}

export default PreLoginHome;
