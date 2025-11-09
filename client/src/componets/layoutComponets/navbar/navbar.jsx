import { Link } from "react-router-dom";
import { useState } from "react";

import { H1 } from "../../singleComponets/heading/heading";
import Image from "../../singleComponets/image/image";
import Button from "../../singleComponets/button/button";
import NavButtons from "./navButtons/navButtons";

import navbar from "./navbar.module.css";
import image from "../../singleComponets/image/image.module.css";
import heading from "../../singleComponets/heading/heading.module.css";
import link from "../../singleComponets/link/link.module.css";
import button from "../../singleComponets/button/button.module.css";

function Navbar({ m_btns, d_btns, path }) {
  const [mToggle, setToggle] = useState(false);
  const handleMenuClick = () => setToggle(!mToggle);

  return (
    <nav className={navbar.navbar}>
      <Link
        to={path}
        className={link.nhead}
        children={
          <>
            <Image
              className={image.logo}
              src="/assets/medias/images/logo.png"
            />
            <H1 className={heading.brandname} text="Wealth Manager" />
          </>
        }
      />
      <div className={navbar.navoptions}>
        <NavButtons btns={d_btns} />
      </div>
      <div className={navbar.menu}>
        <Button
          className={button.menubtn}
          onClick={handleMenuClick}
          children={
            <Image
              className={image.logo}
              src="/assets/medias/images/menu.png"
            />
          }
        />
      </div>

      <div
        className={`${navbar.menuToggle} ${mToggle ? navbar.mTogleopen : ""}`}>
        <NavButtons btns={m_btns} />
      </div>
    </nav>
  );
}

export default Navbar;
