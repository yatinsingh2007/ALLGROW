"use client"
import { Button } from "@/components/ui/button";
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
export default function Login() {
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
                <Input id="email" type="email" placeholder="name@example.com" />
                </div>
                <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="Password"/>
                </div>
            </div>
            </form>
        </CardContent>
        <CardFooter>
            <Button className="w-full bg-white text-black hover:scale-105 hover:bg-white hover:text-black cursor-pointer">Sign In</Button>
        </CardFooter>
        </Card>
    )
}