"use client";
import { createContext , useState , useEffect , ReactNode } from "react";

interface ProtectedRouteContextType {
  Authloading: boolean;
  isAuthenticated: boolean;
  token : string | null;
}

const ProtectedRouteContext = createContext<ProtectedRouteContextType | undefined>(undefined);


const ProtectedRouteProvider = ({ children } : {children : ReactNode}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [Authloading, setAuthLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsAuthenticated(true);
      setToken(storedToken);
    }
    setAuthLoading(false);
  }, []);

  return (
    <ProtectedRouteContext.Provider value={{ isAuthenticated, token , Authloading }}>
      {children}
    </ProtectedRouteContext.Provider>
  );
}

export { ProtectedRouteContext, ProtectedRouteProvider };