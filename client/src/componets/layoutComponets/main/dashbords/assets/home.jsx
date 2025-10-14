import { H1 } from "../../../../singleComponets/heading/heading";

import homeStyle from "./home.module.css";

function Home({ style, name, ...props }) {
  return (
    <main className={homeStyle.main} style={style}>
      <div className="mainSection">
          
      </div>
    </main>
  );
}

export default Home;
