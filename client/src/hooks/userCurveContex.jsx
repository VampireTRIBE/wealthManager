import { createContext, useState, useContext, useEffect } from "react";
import api from "../servises/apis/apis";
import { useUser } from "../hooks/userContext";
import { useAutoRefresh } from "../utills/helpers/refreshManager";

const UserCurveContext = createContext();

export const UserCurveProvider = ({ children }) => {
  const [userCurveData, setUserCurveData] = useState(() => {
    const saved = localStorage.getItem("userCurveData");
    return saved ? JSON.parse(saved) : null;
  });

  const { userData } = useUser();

  // 🧠 Save curve data to localStorage whenever it changes
  useEffect(() => {
    if (userCurveData) {
      localStorage.setItem("userCurveData", JSON.stringify(userCurveData));
    } else {
      localStorage.removeItem("userCurveData");
    }
  }, [userCurveData]);

  // 🧩 Fetch once when component mounts or user changes
  useEffect(() => {
    const userId = userData?.user?._id;
    if (!userId) return;

    const fetchUserCurveData = async () => {
      try {
        const res = await api.get(`/${userId}/live`);
        if (res?.data?.CData) {
          setUserCurveData(res.data.CData);
        }
      } catch (err) {
        console.error("Error fetching user curve data:", err);
        setUserCurveData(null);
      }
    };

    if (!userCurveData) fetchUserCurveData();
  }, [userData?.user?._id]);

  return (
    <UserCurveContext.Provider value={{ userCurveData, setUserCurveData }}>
      <AutoRefreshCurveWrapper />
      {children}
    </UserCurveContext.Provider>
  );
};

function AutoRefreshCurveWrapper() {
  useAutoRefresh(40000); 
  return null;
}

// 🔧 Hook to access the curve data context
export const useUserCurve = () => useContext(UserCurveContext);
