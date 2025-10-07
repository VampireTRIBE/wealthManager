import Button from "../singleComponets/buttonsComponets";
import H1 from "../singleComponets/headingsComponents";
import Image from "../singleComponets/imgsComponets";
import { useState } from "react";
import "../../assets/styles/navbar.css";
import authentication from "../../servises/authentication";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handlebutton = () => {
    authentication.loginReq();
  };

  return (
    <nav className="navbar">
      <a href="">
        <Image
          className="logo"
          src="/assets/medias/images/logo.png"
          alt="Logo"
        />
        <H1 className="brandname" text="Wealth Manager" />
      </a>
      <div>
        <label
          className="menubar"
          htmlFor="togle-menu"
          onClick={() => setMenuOpen(!menuOpen)}>
          <Image
            className="logo"
            src="/assets/medias/images/menu.png"
            alt="Logo"
          />
        </label>
        <input type="checkbox" id="togle-menu" hidden />

        <Button
          onClick={handlebutton}
          className="btn-login"
          text="Login"
          hidden
        />
        <Button className="btn-signup" text="SignUp" hidden />

        <div
          className="sidebar"
          style={{
            right: menuOpen ? "0" : "-500px",
          }}>
          <Button text="Login" />
          <Button text="SignUp" />
        </div>
      </div>
    </nav>
  );
}
