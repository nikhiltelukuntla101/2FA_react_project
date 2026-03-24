import { createContext, useContext, useState } from "react";

const SessionContext = createContext();
export const useSession = () => useContext(SessionContext);

const getStoredUser = () => {
  try {
    const data = sessionStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Invalid JSON:", err);
    return null;
  }
};

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!getStoredUser());

  // useEffect(() => {
  //   const storedUser = JSON.parse(sessionStorage.getItem("user"));
  //   console.log("The useEffect runs", storedUser);
  //   if (storedUser) {
  //     setUser(storedUser);
  //     setIsLoggedIn(true);
  //   }
  //   setLoading(false)
  // }, []);

  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = (data) => {
    if (data) {
      setIsLoggedIn(false);
      setUser(null);
      sessionStorage.removeItem("user");
    }
  };
  return (
    <SessionContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};
