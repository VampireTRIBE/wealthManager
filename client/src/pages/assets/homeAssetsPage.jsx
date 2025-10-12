import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import api from "../../servises/apis/apis";
import { useUser } from "../../hooks/userContext";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import SubNavbar from "../../componets/layoutComponets/navbar/secnavbar";
import Home from "../../componets/layoutComponets/main/dashbords/assets/home";
import Button from "../../componets/singleComponets/button/button";
import Image from "../../componets/singleComponets/image/image";

import buttonStyle from "../../componets/singleComponets/button/button.module.css";
import imgStyle from "../../componets/singleComponets/image/image.module.css";

export default function HomeAssets() {
  const { id, c } = useParams();
  const navigate = useNavigate();

  const [editingCatId, setEditingCatId] = useState(null);
  const [editedName, setEditedName] = useState("");

  const { userData, setUserData } = useUser();
  if (!userData) return <p>Loading...</p>;
  console.log(userData);

  const handleLogout = async () => {
    try {
      const res = await api.get("/logout");
      setUserData(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  if (!["incomes", "expenses", "assets"].includes(c)) {
    return <p>Bad Request</p>;
  }

  const handleEditDeleteCat = async (c_id, s_id, edit = true) => {
    try {
      let res;

      if (edit) {
        res = await api.patch(`/home/${id}/${c_id}/${s_id}`, {
          name: editedName,
        });
      } else {
        res = await api.delete(`/home/${id}/${c_id}/${s_id}`);
      }
      setUserData(res.data.Data);
    } catch (error) {
      console.error("Error in handleEditDeleteCat:", error);
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

  const subButtons = (arr, btnClass) =>
    arr.map((cat) => ({
      className: btnClass,
      onClick:
        editingCatId === cat._id
          ? undefined
          : () => navigate(`/home/${id}/${c}/${cat.name.toLowerCase()}`),
      text:
        editingCatId === cat._id ? (
          <>
            <input
              type="text"
              value={editedName}
              autoFocus
              onChange={(e) => setEditedName(e.target.value)}
              className={buttonStyle.editInput}
            />
            <span
              className={buttonStyle.saveBtn}
              onClick={(e) => {
                e.stopPropagation();
                handleEditDeleteCat(parentCategory?._id, cat._id, true);
                setEditingCatId(null);
              }}>
              ✅
            </span>
            <span
              className={buttonStyle.cancelBtn}
              onClick={(e) => {
                e.stopPropagation();
                setEditingCatId(null);
                setEditedName("");
              }}>
              ❌
            </span>
          </>
        ) : (
          <>
            {cat.name}
            <Image
              className={imgStyle.subimg}
              src="/assets/medias/images/edit.png"
              alt="Edit"
              onClick={(e) => {
                e.stopPropagation();
                setEditingCatId(cat._id);
                setEditedName(cat.name);
              }}
            />
            <Image
              className={imgStyle.subimg}
              src="/assets/medias/images/close.png"
              alt="Delete"
              onClick={(e) => {
                e.stopPropagation();
                handleEditDeleteCat(parentCategory?._id, cat._id, false);
              }}
            />
          </>
        ),
    }));

  const d_btns = subButtons(subCategories, buttonStyle.snbtns);

  return (
    <>
      <header>
        <Navbar
          d_btns={navButtons(categories, buttonStyle.nbutton)}
          m_btns={navButtons(categories, buttonStyle.mnbtns)}
          path={`/home/${id}`}
        />
        {d_btns.length > 0 ? (
          <SubNavbar d_btns={d_btns} c_id={parentCategory?._id} />
        ) : null}
      </header>
      <>
        {d_btns.length > 0 ? <Home style={{ paddingTop: "10px" }} /> : <Home />}
      </>
      <footer></footer>
    </>
  );
}
