// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Create the actual context
const AuthContext = createContext();

// 2. Create the provider component
export default function AuthProvider ({ children }) {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access-token');
    setIsLoggedIn(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem('access-token', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');
    
    setIsLoggedIn(false);
    setCart([]);
    setNotifications([]);
  };

  const addNotification = (message) =>
    setNotifications((prev) => [...prev, { id: Date.now(), message }]);
  const removeNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        cart,
        setCart,
        notifications,
        addNotification,
        removeNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook for usage
export const useAppContext = () => useContext(AuthContext);