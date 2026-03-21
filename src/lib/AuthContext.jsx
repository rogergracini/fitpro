import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({});

// 1. Verifique se o nome aqui é AuthProvider
export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({ user: null, isAuthenticated: false });
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const checkUserAuth = async () => {
    try {
      const isLogged = localStorage.getItem("fitpro_admin_logged") === "true";
      if (isLogged) {
        setAuth({
          user: { nome: "Rogério Gracini", email: "fatordesigner@gmail.com" },
          isAuthenticated: true
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    checkUserAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ ...auth, isLoadingAuth, checkUserAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// 2. Verifique se o hook useAuth também está exportado
export const useAuth = () => useContext(AuthContext);