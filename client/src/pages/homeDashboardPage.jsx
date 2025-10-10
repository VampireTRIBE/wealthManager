import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import buttonStyle from "../componets/singleComponets/button/button.module.css";
import Navbar from "../componets/layoutComponets/navbar/navbar";
import HomeDashbord from "../componets/layoutComponets/main/dashbord/homedashbord";
import api from "../servises/apis/apis";

export default function HomePagePostLogin() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleLogout = async (id) => {
    try {
      const res = await api.get("/logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <header>
        <Navbar
          d_btns={[
            {
              text: "logOut",
              className: buttonStyle.nbutton,
              onClick: () => {
                handleLogout(id);
              },
            },
          ]}
          m_btns={[
            {
              text: "LogOut",
              className: buttonStyle.mnbtns,
              onClick: () => {
                handleLogout(id);
              },
            },
          ]}
          path={`/home/${id}`}
        />
      </header>
      <>
        <HomeDashbord id={id} />
      </>
      <footer></footer>
    </>
  );
}
