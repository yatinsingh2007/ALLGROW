"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ShineBorder } from "@/components/magicui/shine-border"
import React, { useState } from "react"
import api from "@/lib/axios"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
interface User{
  name : string ,
  email : string ,
  password : string ,
  confirmPassword : string
}

export default function SignupCard() {
  const router = useRouter();
  const [userDetails , setUserDetails] = useState<User>({name : "" , email : "" , password : "" , confirmPassword : ""})
  const handleSignup = async (e : React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (userDetails.password !== userDetails.confirmPassword){
      return toast.error("Passwords do not match")
    }
    try{
      await api.post("/register" , {
        name : userDetails.name ,
        email : userDetails.email ,
        password : userDetails.password
      })
      toast.success("Account created successfully !! , Now Please Login")
      router.push("/login")
    }catch(err){
      console.log(err);
      return toast.error("Something went wrong")
    }
  }
  return (
    <Card className="relative overflow-hidden max-w-[350px] w-full border-2 border-black bg-black text-white" style={{width: '60vw'}}>
      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />

      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription className="text-gray-200">
          Create a new account to get started
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullname">Full Name</Label>
              <Input id="fullname" type="text" placeholder="John Doe" required onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
                e.preventDefault();
                setUserDetails({...userDetails , name : e.target.value})
              }}/>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" required onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
                e.preventDefault();
                setUserDetails({...userDetails , email : e.target.value})
              }}/>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="*******" required onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
                e.preventDefault();
                setUserDetails({...userDetails , password : e.target.value})
              }}/>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" placeholder="*******" required onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
                e.preventDefault();
                setUserDetails({...userDetails , confirmPassword : e.target.value})
              }}/>
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button className="w-full bg-white text-black hover:bg-white hover:text-black hover:scale-105 cursor-pointer" onClick={handleSignup}>Create Account</Button>
      </CardFooter>
    </Card>
  )
}
