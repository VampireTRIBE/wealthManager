import { H1 } from "../../../singleComponets/heading/heading";

import homedashbordStyle from "./homedashbord.module.css";

function HomeDashbord({ name, ...props }) {
  return (
    <main className={homedashbordStyle.main}>
      <H1 className={homedashbordStyle.title} text={`Hi... ${name}`} />
      <H1 className={homedashbordStyle.title} text={`Welcome to Wealth Manager`} />
    </main>
  );
}

export default HomeDashbord;
