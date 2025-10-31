import React, { createContext, useState, useEffect } from "react";
import { saveData, getData, removeData } from "../utils/storage";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    (async () => {
      const storedUsers = await getData("users");
      const storedCurrentUser = await getData("currentUser");
      if (storedUsers) setUsers(storedUsers);
      if (storedCurrentUser) setCurrentUser(storedCurrentUser);
    })();
  }, []);

  const register = async (nome, email, senha, tipo) => {
    const exists = users.find((u) => u.email === email);
    if (exists) return { success: false, message: "Usuário já existe." };

    const newUser = { id: Date.now().toString(), nome, email, senha, tipo };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    await saveData("users", updatedUsers);
    return { success: true, message: "Registro efetuado com sucesso!" };
  };

  const login = async (email, senha) => {
    const foundUser = users.find((u) => u.email === email && u.senha === senha);
    if (foundUser) {
      setCurrentUser(foundUser);
      await saveData("currentUser", foundUser);
      return { success: true, user: foundUser, message: "Login realizado com sucesso!" };
    }
    return { success: false, message: "Credenciais inválidas." };
  };

  const logout = async () => {
    setCurrentUser(null);
    await removeData("currentUser");
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
