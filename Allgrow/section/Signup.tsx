"use client"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { ShineBorder } from "@/components/magicui/shine-border"

export default function SignupCard() {
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
              <Input id="fullname" type="text" placeholder="John Doe" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="name@example.com" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Password" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" placeholder="Confirm password" />
            </div>
          </div>
        </form>
      </CardContent>

      <CardFooter>
        <Button className="w-full bg-white text-black hover:bg-white hover:text-black hover:scale-105 cursor-pointer">Create Account</Button>
      </CardFooter>
    </Card>
  )
}
