import { useState } from "react";
import Navbar from "../componets/navbarComponent/navbar";
import "../assets/styles/homePage.css";
import Button from "../componets/singleComponets/buttonsComponets";
import H1 from "../componets/singleComponets/headingsComponents";

export default function HomePage() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main className="main">
        <H1 text="Welcome to Wealth Manager"/>
        <div>
          <Button style={{backgrondColor:"#1e3a8a", borderColor: "#000000", color:"#000000"}} className="btn-login" text="Login" />
          <Button style={{backgrondColor:"#1e3a8a", borderColor: "#000000", color:"#000000"}} className="btn-signup" text="SignUp" />
        </div>
      </main>
      <footer></footer>
    </>
  );
}
