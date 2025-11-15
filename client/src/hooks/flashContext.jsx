import { createContext, useContext, useState, useCallback } from "react";

const FlashContext = createContext();

export function FlashProvider({ children }) {
  const [flash, setFlash] = useState(null);

  const showFlash = useCallback((msg, type = "info", duration = 5000) => {
    setFlash({ msg, type });
    setTimeout(() => {
      setFlash(null);
    }, duration);
  }, []);

  return (
    <FlashContext.Provider value={{ flash, showFlash }}>
      {children}
    </FlashContext.Provider>
  );
}

export function useFlash() {
  return useContext(FlashContext);
}
