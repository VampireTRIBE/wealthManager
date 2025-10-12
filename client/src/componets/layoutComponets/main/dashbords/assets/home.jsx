import { H1 } from "../../../../singleComponets/heading/heading";

import homeStyle from "./home.module.css";

function Home({ style, name, ...props }) {
  return (
    <main className={homeStyle.main} style={style}>
      <H1 className={homeStyle.title} text={`Hi... ${name}`} />
      <H1 className={homeStyle.title} text={`Welcome to Assets Page`} />
    </main>
  );
}

export default Home;
