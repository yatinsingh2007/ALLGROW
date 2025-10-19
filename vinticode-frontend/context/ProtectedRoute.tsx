"use client";
import { createContext , useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectRouteContextType {
  isAuthenticated: boolean;
  setIsAuthenticated : React.Dispatch<React.SetStateAction<boolean>>
}

export const ProtectRouteContext = createContext<ProtectRouteContextType | null>(null);

const ProtectedRouteProvider = ({ children }: { children : React.ReactNode}) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const token : string | null = localStorage.getItem("token");
    if (!token){
      router.push('/auth')
    }
  })

  return (
    <ProtectRouteContext.Provider value={{isAuthenticated , setIsAuthenticated}}>
      {children}
    </ProtectRouteContext.Provider>
  );
};

export default ProtectedRouteProvider;