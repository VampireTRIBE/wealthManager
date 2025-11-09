import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../servises/apis/apis";
import { useAutoRefresh } from "../utills/helpers/refreshManager";
import { useUserCurve } from "./userCurveContex";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();
  
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);
  
  useEffect(() => {
    const verifySession = async () => {
      const { userCurveData, setUserCurveData } = useUserCurve();
      try {
        const res = await api.get("/islogedin");
        setUserData(res.data);
        setUserCurveData(res.data);
      } catch (err) {
        setUserData(null);
        setUserCurveData(null);
        navigate("/login");
      }
    };
    if (!userData) verifySession();
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      <AutoRefreshWrapper />
      {children}
    </UserContext.Provider>
  );
};

function AutoRefreshWrapper() {
  useAutoRefresh(40000);
  return null;
}

export const useUser = () => useContext(UserContext);
