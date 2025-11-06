import { useEffect } from "react";
import api from "../../servises/apis/apis";
import { useUser } from "../../hooks/userContext";
import { useUserCurve } from "../../hooks/userCurveContex";

export function useAutoRefresh(intervalMs = 40000) {
  const userContext = useUser();
  const curveContext = useUserCurve?.();

  if (!userContext) return;
  const { userData, setUserData } = userContext;

  // 🛡️ Prevent crash if curve context not yet available
  const setUserCurveData = curveContext?.setUserCurveData;

  useEffect(() => {
    const userId = userData?.user?._id;
    if (!userId) return;

    const refresh = async () => {
      try {
        const res = await api.get(`/${userId}/live`);
        if (res?.data?.Data) {
          setUserData(res.data.Data);
          if (setUserCurveData) setUserCurveData(res?.data?.CData);
        }
      } catch (err) {
        console.error("[AutoRefresh] Failed:", err.message);
      }
    };

    const interval = setInterval(refresh, intervalMs);
    return () => clearInterval(interval);
  }, [userData?.user?._id, intervalMs]);
}
