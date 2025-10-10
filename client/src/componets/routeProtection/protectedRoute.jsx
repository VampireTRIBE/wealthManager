
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../servises/apis/apis";

export default function ProtectRoute({ children }) {
  const [isAuth, setIsAuth] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/islogedin"); 
        setIsAuth(res.data.authenticated);
      } catch (err) {
        setIsAuth(false);
      }
    };
    checkAuth();
  }, []);
  if (isAuth === null) return <p>Loading...</p>;

  return isAuth ? children : <Navigate to="/login" replace />;
}
