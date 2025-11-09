import { createContext, useState, useContext, useEffect } from "react";

const UserCurveContext = createContext();

export const UserCurveProvider = ({ children }) => {
  const [userCurveData, setUserCurveData] = useState(() => {
    const saved = localStorage.getItem("userCurveData");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (userCurveData) {
      localStorage.setItem("userCurveData", JSON.stringify(userCurveData));
    } else {
      localStorage.removeItem("userCurveData");
    }
  }, [userCurveData]);

  return (
    <UserCurveContext.Provider value={{ userCurveData, setUserCurveData }}>
      {children}
    </UserCurveContext.Provider>
  );
};

export const useUserCurve = () => useContext(UserCurveContext);
