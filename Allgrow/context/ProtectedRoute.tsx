import { createContext, ReactNode, useState } from 'react';

interface ProtectRouteContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

export const ProtectRouteContext = createContext<ProtectRouteContextType | null>(null);

interface ProtectedRouteProviderProps {
  children: ReactNode;
}

const ProtectedRouteProvider = ({ children }: ProtectedRouteProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <ProtectRouteContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </ProtectRouteContext.Provider>
  );
};

export default ProtectedRouteProvider;
