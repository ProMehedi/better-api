'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { authClient, useSession } from '~/lib/auth'
import { Flower, Github, Loader2 } from 'lucide-react'
import { Separator } from '~/components/ui/separator'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function Home() {
  const [isGithubLoading, setIsGithubLoading] = React.useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false)

  const router = useRouter()
  const { data: session } = useSession()

  const handleGithubLogin = async () => {
    setIsGithubLoading(true)
    await authClient.signIn.social(
      {
        provider: 'github',
        callbackURL: window.location.origin,
      },
      {
        onError: ({ error }) => {
          toast.error('GitHub login failed', {
            description: 'Could not authenticate with GitHub.',
          })

          setIsGithubLoading(false)
        },
      }
    )
  }

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true)
    await authClient.signIn.social(
      {
        provider: 'google',
        callbackURL: window.location.origin,
      },
      {
        onError: ({ error }) => {
          toast.error('Google login failed', {
            description: 'Could not authenticate with Google.',
          })

          setIsGoogleLoading(false)
        },
      }
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-md border-indigo-200'>
        <CardHeader className='text-center'>
          <div className='mx-auto bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2'>
            <Flower className='h-6 w-6 text-indigo-500' />
          </div>
          <CardTitle className='text-2xl font-bold text-indigo-700'>
            Better Auth
          </CardTitle>
          <CardDescription>
            Secure authentication with a beautiful interface
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-center text-muted-foreground'>
            Welcome to Better Auth, a simple and secure authentication system
            with a modern interface.
          </p>
          <div className='grid gap-4'>
            {session ? (
              <>
                <Link href='/dashboard' className='w-full'>
                  <Button className='w-full bg-indigo-600 hover:bg-indigo-700'>
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant='outline'
                  className='w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                  onClick={() => authClient.signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <div className='grid grid-cols-2 gap-4'>
                  <Button
                    variant='outline'
                    className='border-indigo-200'
                    onClick={handleGithubLogin}
                    disabled={isGithubLoading}
                  >
                    {isGithubLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <Github className='mr-2 h-4 w-4' />
                    )}
                    GitHub
                  </Button>
                  <Button
                    variant='outline'
                    type='button'
                    className='border-indigo-200'
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading}
                  >
                    {isGoogleLoading ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <svg className='mr-2 h-4 w-4' viewBox='0 0 24 24'>
                        <path
                          d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                          fill='#4285F4'
                        />
                        <path
                          d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                          fill='#34A853'
                        />
                        <path
                          d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                          fill='#FBBC05'
                        />
                        <path
                          d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                          fill='#EA4335'
                        />
                        <path d='M1 1h22v22H1z' fill='none' />
                      </svg>
                    )}
                    Google
                  </Button>
                </div>
                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <Separator className='w-full' />
                  </div>
                  <div className='relative flex justify-center text-xs uppercase'>
                    <span className='bg-white px-2 text-muted-foreground'>
                      Or continue with
                    </span>
                  </div>
                </div>
                <div className='flex flex-col space-y-2'>
                  <Link href='/auth/login' className='w-full'>
                    <Button className='w-full bg-indigo-600 hover:bg-indigo-700'>
                      Login with Email
                    </Button>
                  </Link>
                  <Link href='/auth/register' className='w-full'>
                    <Button
                      variant='outline'
                      className='w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className='flex justify-center border-t border-indigo-100 pt-4'>
          <p className='text-xs text-muted-foreground'>
            &copy; {new Date().getFullYear()} Better Auth Demo
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
