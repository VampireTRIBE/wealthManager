import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import buttonStyle from "../componets/singleComponets/button/button.module.css";
import Navbar from "../componets/layoutComponets/navbar/navbar";
import HomeDashbord from "../componets/layoutComponets/main/dashbord/homedashbord";
import api from "../servises/apis/apis";
import { useUser } from "../hooks/userContext";
import { navPostLogin } from "../utills/helpers/buttonsArray/navbuton";

export default function HomePagePostLogin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
  console.log(userData)
  if (!userData) return <p>Loading...</p>;

  const handleLogout = async (id) => {
    try {
      const res = await api.get("/logout");
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const categories = userData.categories || [];

  const d_btns = [
    ...categories.map((el,index) => ({
      text: el.name,
      className: buttonStyle.nbutton,
      onClick: () => navigate(`/home/${id}/${el.name.toLowerCase()}`),
      dis: index,
    })),
    {
      text: "LogOut",
      className: buttonStyle.nbutton,
      onClick: () => handleLogout(id),
      dis: categories.length,
    },
  ];

  const m_btns = [
    ...categories.map((el,index) => ({
      text: el.name,
      className: buttonStyle.mnbtns,
      onClick: () => navigate(`/home/${id}/${el.name.toLowerCase()}`),
      dis: index,
    })),
    {
      text: "LogOut",
      className: buttonStyle.mnbtns,
      onClick: () => handleLogout(id),
      dis: categories.length,
    },
  ];

  return (
    <>
      <header>
        <Navbar d_btns={d_btns} m_btns={m_btns} path={`/home/${id}`} />
      </header>
      <>
        <HomeDashbord name={userData.user.firstName} />
      </>
      <footer></footer>
    </>
  );
}
