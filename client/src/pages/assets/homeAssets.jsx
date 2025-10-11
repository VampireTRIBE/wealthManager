import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import SubNavbar from "../../componets/layoutComponets/navbar/secnavbar";
import buttonStyle from "../../componets/singleComponets/button/button.module.css";

import api from "../../servises/apis/apis";
import { useUser } from "../../hooks/userContext";
import Home from "../../componets/layoutComponets/main/assets/home";

export default function HomeAssets() {
  const { id, c } = useParams();
  const navigate = useNavigate();
  const { userData, setUserData } = useUser();
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

  const categories = userData?.categories || [];
  const parentCategory = categories.find((cat) => cat.name.toLowerCase() === c);

  const subCategories = parentCategory?.subCategories || [];

  const navButtons = (arr, btnClass) => [
    ...arr.map((cat, i) => ({
      dis: i,
      text: cat.name,
      className: btnClass,
      onClick: () => navigate(`/home/${id}/${cat.name.toLowerCase()}`),
    })),
    {
      dis: arr.length,
      text: "LogOut",
      className: btnClass,
      onClick: handleLogout,
    },
  ];

  const subButtons = (arr, btnClass) => [
    ...arr.map((cat, i) => ({
      dis: i,
      text: cat.name,
      className: btnClass,
      onClick: () => navigate(`/home/${id}/${c}/${cat.name.toLowerCase()}`),
    })),
  ];

  const d_btns = subButtons(subCategories, buttonStyle.snbtns);
  const extraButtons = Array(10).fill({
    text: "power",
    className: buttonStyle.snbtns,
    onClick: () => {},
  });

  const dbtns = [...d_btns, ...extraButtons];

  return (
    <>
      <header>
        <Navbar
          d_btns={navButtons(categories, buttonStyle.nbutton)}
          m_btns={navButtons(categories, buttonStyle.mnbtns)}
          path={`/home/${id}`}
        />
        {d_btns.length > 0 ? <SubNavbar d_btns={d_btns} /> : null}
      </header>
      {/* <>
        <Home/>
      </> */}
      <footer></footer>
    </>
  );
}
