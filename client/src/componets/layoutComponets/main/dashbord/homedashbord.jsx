import { useNavigate } from "react-router-dom";
import { H1 } from "../../../singleComponets/heading/heading";
import postLoginStyle from "./postlogin.module.css";
import headingStyle from "../../../singleComponets/heading/heading.module.css";
import buttonStyle from "../../../singleComponets/button/button.module.css";
import NavButtons from "../../navbar/navButtons/navButtons";

function HomeDashbord({ id, ...props }) {
  const navigate = useNavigate();
  return (
    <main className={postLoginStyle.main}>
      <H1 className={headingStyle.title} text={`Hi... ${id}`} />
      <H1 className={headingStyle.title} text={`Welcome to Wealth Manager`} />
    </main>
  );
}

export default HomeDashbord;
