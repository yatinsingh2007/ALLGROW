"use client"
import { Button } from "@/components/ui/button";
import { Eye , EyeOff } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShineBorder } from "@/components/magicui/shine-border";
import { useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
interface Credentials {
    name : string ,
  email: string;
  password: string;
}
export default function Login() {
    const router = useRouter();
    const [details , setDetails] = useState<Credentials>({name : "" , email: "", password: ""});
    const [passwordType , setPasswordType] = useState<"password" | "text">("password")
    const handleLogin = async (e : React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try{
            const res = await api.post("/auth/login" , {
                email : details.email ,
                password : details.password
            })
            localStorage.setItem("token" , res.data.token)
            toast.success("Logged in successfully")
            router.push("/dashboard/home")
            toast.dismiss()
            return
        }catch(err){
            console.log(err);
            return toast.error(err.response?.data.error)
        }
    }
    return (
        <Card className="relative overflow-hidden max-w-[400px] w-full border-2 border-black bg-black text-white" style={{width: '60vw'}}>
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription className="text-gray-200">
            Enter your credentials to access your account
            </CardDescription>
        </CardHeader>
        <CardContent>
            <form>
            <div className="grid gap-4">
                <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" onChange={(e : React.ChangeEvent<HTMLInputElement>) => 
                    setDetails({...details , email : e.target.value})
                }/>
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id={passwordType} type={passwordType} placeholder="*********" onChange={(e : React.ChangeEvent<HTMLInputElement>) => 
                    setDetails({...details , password : e.target.value})
                } className="relative"/>
                {
                passwordType == "password" ? <EyeOff className="absolute right-8 bottom-[5.5rem] cursor-pointer" onClick={() => setPasswordType("text")}/>  : <Eye className="absolute right-8 bottom-[5.5rem] cursor-pointer" onClick={() => setPasswordType("password")}/>
                }
                </div>
            </div>
            </form>
        </CardContent>
        <CardFooter>
            <Button className="w-full bg-white text-black hover:scale-105 hover:bg-white hover:text-black cursor-pointer" onClick={handleLogin} type="submit">Sign In</Button>
        </CardFooter>
        </Card>
    )
}