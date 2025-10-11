import { useRef, useEffect } from "react";
import NavButtons from "./navButtons/navButtons";
import { H3 } from "../../singleComponets/heading/heading";
import subnavbarStyle from "./secnavbar.module.css";
import useScroll from "../../../hooks/scroll";

function SubNavbar({ d_btns }) {
  const scrollRef = useScroll("horizontal", 2);

  return (
    <nav className={subnavbarStyle.navbar}>
      <H3 className={subnavbarStyle.cat}
        style={{ color: "#ffffff", fontSize: "1.3rem" }}
        text="Categories:"
      />
      <div className={subnavbarStyle.nbuttons} ref={scrollRef}>
        <NavButtons btns={d_btns} />
      </div>
    </nav>
  );
}

export default SubNavbar;
