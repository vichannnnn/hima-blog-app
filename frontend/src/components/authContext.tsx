import React, { createContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { isTokenExpired } from "../utils/auth";

export interface User {
  user_id: number;
  username: string;
  user_type: number;
  is_active: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  updateUser: () => {},
});

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  value: AuthContextType;
}> = ({ children, value }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (user && isTokenExpired()) {
        logout();
      }
    }, 60 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [user]);

  const login = async (username: string, password: string) => {
    const response = await apiClient.post("/auth/login", {
      username,
      password,
    });
    const { data, access_token } = response.data;
    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("access_token", access_token);
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
