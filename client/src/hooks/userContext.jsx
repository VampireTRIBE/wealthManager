import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../servises/apis/apis";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  // 🔄 Keep localStorage synced with userData
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  // 🧠 Verify login session once (and set user info)
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await api.get("/islogedin");

        // ✅ Expect structure from backend:
        // { user: { _id, firstName, lastName, email }, ...otherData }
        if (res.data) {
          setUserData(res.data);
        } else {
          throw new Error("Invalid session");
        }
      } catch (err) {
        console.error("Session verification failed:", err.message);
        setUserData(null);
        navigate("/login");
      }
    };

    if (!userData) verifySession();
  }, []); // run once on mount

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
