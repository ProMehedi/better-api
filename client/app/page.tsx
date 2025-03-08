import Link from "next/link"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Flower } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-rose-200">
        <CardHeader className="text-center">
          <div className="mx-auto bg-rose-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <Flower className="h-6 w-6 text-rose-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-rose-700">Better Auth</CardTitle>
          <CardDescription>Secure authentication with a beautiful interface</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-muted-foreground">
            Welcome to Better Auth, a simple and secure authentication system with a rose-themed interface.
          </p>
          <div className="flex flex-col space-y-2">
            <Link href="/login" className="w-full">
              <Button className="w-full bg-rose-500 hover:bg-rose-600">Login</Button>
            </Link>
            <Link href="/register" className="w-full">
              <Button variant="outline" className="w-full border-rose-200 text-rose-700 hover:bg-rose-50">
                Register
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-rose-100 pt-4">
          <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} Better Auth Demo</p>
        </CardFooter>
      </Card>
    </div>
  )
}

