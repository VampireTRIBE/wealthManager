import { useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import api from "../../servises/apis/apis";

import Navbar from "../../componets/layoutComponets/navbar/navbar";
import SubNavbar from "../../componets/layoutComponets/navbar/secnavbar";
import Home from "../../componets/layoutComponets/main/dashbords/assets/home";
import Button from "../../componets/singleComponets/button/button";
import Image from "../../componets/singleComponets/image/image";

import buttonStyle from "../../componets/singleComponets/button/button.module.css";
import imgStyle from "../../componets/singleComponets/image/image.module.css";
import AssetsSection1 from "../../componets/layoutComponets/pageSections/assets/section1";
import AssetsSection2 from "../../componets/layoutComponets/pageSections/assets/section2";
import homePageStyle from "./homePage.module.css";
import AssetsSection3 from "../../componets/layoutComponets/pageSections/assets/section3";

export default function IndividualAssets() {
  const d_btns = [
    { text: "Assets 1", dis: 1, className: buttonStyle.dnbutton },
    { text: "Assets 2", dis: 2, className: buttonStyle.dnbutton },
    { text: "Assets 3", dis: 3, className: buttonStyle.dnbutton },
  ];
  const m_btns = [
    { text: "Assets 1", dis: 1, className: buttonStyle.mnbtns },
    { text: "Assets 2", dis: 2, className: buttonStyle.mnbtns },
    { text: "Assets 3", dis: 3, className: buttonStyle.mnbtns },
  ];

  const assetsData = {
    title: "Comodites",
    date: "10/17/2025 19:29:33",
    content: [
      { label: "Investment Value", value: "10,000" },
      { label: "Current Value", value: "20,000" },
      { label: "Total Gains", value: "10,000" },
      { label: "Current Year Gains", value: "10,000" },
      { label: "IIR %", value: "10%" },
    ],
  };

  const assetssData = [
    {
      title: "Stable Assets",
      onMainClick: () => console.log("Stable Assets clicked"),
      onEdit: () => console.log("Edit stable"),
      onDelete: () => console.log("Delete stable"),
      rows: [
        [
          { label: "Investment Value", value: "10,000" },
          { label: "Current Value", value: "12,000" },
        ],
        [
          { label: "Current Year Gains", value: "2,000" },
          { label: "Total Gains", value: "4,000" },
        ],
        [
          { label: "IRR_%", value: "8%" },
          { label: "Total Value Curve", value: "14,000" },
        ],
      ],
    },
    {
      title: "Growth Assets",
      onMainClick: () => console.log("Growth Assets clicked"),
      onEdit: () => console.log("Edit growth"),
      onDelete: () => console.log("Delete growth"),
      rows: [
        [
          { label: "Investment Value", value: "50,000" },
          { label: "Current Value", value: "65,000" },
        ],
        [
          { label: "Current Year Gains", value: "15,000" },
          { label: "Total Gains", value: "25,000" },
        ],
        [
          { label: "IRR_%", value: "12%" },
          { label: "Total Value Curve", value: "75,000" },
        ],
      ],
    },
  ];

  return (
    <>
      <header>
        <Navbar d_btns={d_btns} m_btns={m_btns} path={`/`} />
        <SubNavbar d_btns={d_btns} c_id={"dklsfjldsf"} />
      </header>
      <main className={homePageStyle.main}>
        <AssetsSection1 data={assetsData} />
        <AssetsSection2
          sections={assetssData}
        />
        <AssetsSection3 />
      </main>
      <footer></footer>
    </>
  );
}
