'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { ArrowLeft, Flower, Loader2, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { authClient } from '~/lib/auth'

export default function ForgotPassword() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Request password reset link
    await authClient.forgetPassword(
      {
        email,
        redirectTo: `${window.location.origin}/login`,
      },
      {
        onSuccess: () => {
          setIsLoading(false)
          setIsSubmitted(true)
        },
      }
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-rose-50 to-white flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-md border-rose-200'>
        <CardHeader className='text-center'>
          <div className='mx-auto bg-rose-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2'>
            <Flower className='h-6 w-6 text-rose-500' />
          </div>
          <CardTitle className='text-2xl font-bold text-rose-700'>
            Reset Password
          </CardTitle>
          <CardDescription>
            {!isSubmitted
              ? 'Enter your email to receive a password reset link'
              : 'Check your email for reset instructions'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='name@example.com'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='border-rose-200 focus-visible:ring-rose-500'
                />
              </div>
              <Button
                type='submit'
                className='w-full bg-rose-500 hover:bg-rose-600'
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Sending request...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>
          ) : (
            <div className='space-y-4'>
              <Alert className='bg-green-50 border-green-200'>
                <CheckCircle className='h-4 w-4' />
                <AlertDescription>
                  <p>
                    If an account exists with the email{' '}
                    <span className='font-medium'>{email}</span>, you will
                    receive password reset instructions shortly.
                  </p>
                </AlertDescription>
              </Alert>
              <Button
                onClick={() => router.push('/login')}
                className='w-full bg-rose-500 hover:bg-rose-600'
              >
                Return to Login
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex justify-center pt-0'>
          {!isSubmitted && (
            <Link
              href='/login'
              className='text-rose-600 hover:underline text-sm flex items-center'
            >
              <ArrowLeft className='mr-1 h-3 w-3' />
              Back to login
            </Link>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
