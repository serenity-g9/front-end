import { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [tipoUsuario, setTipoUsuario] = useState(Cookies.get("tipoUsuario"));

  const login = (userData) => {
    setTipoUsuario(userData.tipoUsuario);
    Cookies.set("tipoUsuario", userData.tipoUsuario);
  };

  const logout = () => {
    setTipoUsuario(null);

    Cookies.remove("TOKEN");
    Cookies.remove("ID");
    Cookies.remove("tipoUsuario");
    Cookies.remove("nome");
    Cookies.remove("profile_picture_url");
  };

  useEffect(() => {
    const storedTipoUsuario = Cookies.get("tipoUsuario");
    if (storedTipoUsuario) {
      setTipoUsuario(storedTipoUsuario);
    }
  }, []);

  return (
    <UserContext.Provider
      value={{ tipoUsuario, setTipoUsuario, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};
