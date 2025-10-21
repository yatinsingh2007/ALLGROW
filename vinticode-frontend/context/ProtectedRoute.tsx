"use client";
import { createContext , useState , useEffect , ReactNode } from "react";

interface ProtectedRouteContextType {
  isAuthenticated: boolean;
  token : string | null;
}

const ProtectedRouteContext = createContext<ProtectedRouteContextType | undefined>(undefined);


const ProtectedRouteProvider = ({ children } : {children : ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
    } else {
      setIsAuthenticated(false);
      setToken(null);
    }
  }, []);

  return (
    <ProtectedRouteContext.Provider value={{ isAuthenticated, token }}>
      {children}
    </ProtectedRouteContext.Provider>
  );
}

export { ProtectedRouteContext, ProtectedRouteProvider };