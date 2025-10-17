import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import api from "../servises/apis/apis";
import { useUser } from "../hooks/userContext";
import useTitle from "../hooks/useTitle";

import Navbar from "../componets/layoutComponets/navbar/navbar";
import HomeDashbord from "../componets/layoutComponets/main/dashbords/homedashbord";

import buttonStyle from "../componets/singleComponets/button/button.module.css";

export default function HomeDashbordPage() {
  useTitle("Wealth Manager - Home");
  const { u_id } = useParams();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await api.get("/logout");
      setUserData(null);
      // navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const d_btns = [
    {
      text: "INCOMES",
      dis: 1,
      className: buttonStyle.dnbutton,
      onClick: () => {
        navigate(`/home/u:id/incomes`);
      },
    },
    {
      text: "ASSETS",
      dis: 2,
      className: buttonStyle.dnbutton,
      onClick: () => {
        navigate(`/home/u:id/assets`);
      },
    },
    {
      text: "EXPENSESS",
      dis: 3,
      className: buttonStyle.dnbutton,
      onClick: () => {
        navigate(`/home/u:id/expenses`);
      },
    },
    { text: "LogOut", dis: 4, className: buttonStyle.dnbutton },
  ];
  const m_btns = [
    {
      text: "INCOMES",
      dis: 1,
      className: buttonStyle.mnbtns,
      onClick: () => {
        navigate(`/home/u:id/incomes`);
      },
    },
    {
      text: "ASSETS",
      dis: 2,
      className: buttonStyle.mnbtns,
      onClick: () => {
        navigate(`/home/u:id/assets`);
      },
    },
    {
      text: "EXPENSESS",
      dis: 3,
      className: buttonStyle.mnbtns,
      onClick: () => {
        navigate(`/home/u:id/incomes`);
      },
    },
    { text: "LogOut", dis: 4, className: buttonStyle.mnbtns },
  ];

  return (
    <>
      <header>
        <Navbar d_btns={d_btns} m_btns={m_btns} path={`/home/${u_id}`} />
      </header>
      <>{/* <HomeDashbord /> */}</>
      <footer></footer>
    </>
  );
}
