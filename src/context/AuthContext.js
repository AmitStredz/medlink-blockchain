import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const key = localStorage.getItem('key');
    setIsAuthenticated(!!key);
    setUserType(localStorage.getItem('user_type'));
    setLoading(false);
  }, []);

  const login = (key) => {
    localStorage.setItem('key', key);
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('key');
    localStorage.removeItem('user_type');
    setIsAuthenticated(false);
    setUserType(null);
  };

  const updateUserType = (type) => {
    localStorage.setItem('user_type', type);
    setUserType(type);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      userType, 
      loading,
      login, 
      logout, 
      updateUserType 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 