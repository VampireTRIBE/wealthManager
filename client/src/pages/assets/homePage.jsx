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

export default function HomeAssets() {
  const { dc_id } = useParams();
  const navigate = useNavigate();
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

  const mm_btns = [
    {
      text: "Emergency Funds",
      dis: 1,
      className: buttonStyle.snbtns,
      onClick: () => {
        navigate(`/home/u:id/incomes`);
      },
    },
    {
      text: "Stable Assets",
      dis: 2,
      className: buttonStyle.snbtns,
      onClick: () => {
        navigate(`/home/u:id/assets`);
      },
    },
    {
      text: "UnStable Assets",
      dis: 3,
      className: buttonStyle.snbtns,
      onClick: () => {
        navigate(`/home/u:id/incomes`);
      },
    },
  ];

  if (dc_id !== "assets") {
    return <p>dfsdsfdsf</p>;
  }

  const assetsData = {
    title: "Assets",
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
      title: "Emergency Funds",
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
      title: "Stable Assets",
      onMainClick: () => {navigate(`/home/:u_id/:dc_id/:sc_id`)},
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
    {
      title: "UnStable Assets",
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
        <SubNavbar d_btns={mm_btns} c_id={"dklsfjldsf"} />
      </header>
      <main className={homePageStyle.main}>
        <AssetsSection1 data={assetsData} />
        <AssetsSection2 sections={assetssData} />
        <AssetsSection3 />
      </main>
      <footer></footer>
    </>
  );
}
