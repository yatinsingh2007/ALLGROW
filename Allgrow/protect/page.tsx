import { createContext , React } from "react";


const ProtectContext = createContext(null)


export default function ProtectContextProvider({ children }: { children: React.ReactNode }) {
    <ProtectContext.Provider value = {{}}>
        {children}
    </ProtectContext.Provider>
}