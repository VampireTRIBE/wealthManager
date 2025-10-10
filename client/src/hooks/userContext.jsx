import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../servises/apis/apis";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    // Load saved user data from localStorage
    const saved = localStorage.getItem("userData");
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  // Save userData to localStorage whenever it changes
  useEffect(() => {
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    } else {
      localStorage.removeItem("userData");
    }
  }, [userData]);

  // On mount, verify session with the backend
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await api.get("/islogedin"); // backend returns logged-in user info
        setUserData(res.data);
      } catch (err) {
        setUserData(null);
        navigate("/login");
      }
    };

    if (!userData) {
      verifySession();
    }
  }, []);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
