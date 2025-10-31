import { useState, useEffect } from "react";
import api from "../../servises/apis/apis";

export const formatDateTime = (date = new Date()) => {
  const d = new Date(date);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${mm}/${dd}/${yyyy} ${hh}:${min}:${ss}`;
};

export const useLiveDateTime = () => {
  const [currentDate, setCurrentDate] = useState(formatDateTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(formatDateTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return currentDate;
};

export const logoutUser = async (setUserData, navigate) => {
  try {
    await api.get("/logout");
    setUserData(null);
    navigate("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};