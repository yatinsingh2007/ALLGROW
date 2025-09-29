"use client";
import { createContext , useState } from 'react';

interface ProtectRouteContextType {
  isAuthenticated: boolean;
  setIsAuthenticated : React.Dispatch<React.SetStateAction<boolean>>
}

export const ProtectRouteContext = createContext<ProtectRouteContextType | null>(null);

const ProtectedRouteProvider = ({ children }: { children : React.ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  return (
    <ProtectRouteContext.Provider value={{isAuthenticated , setIsAuthenticated}}>
      {children}
    </ProtectRouteContext.Provider>
  );
};

export default ProtectedRouteProvider;