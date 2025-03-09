'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Flower, Loader2 } from 'lucide-react'
//
import { authClient } from '~/lib/auth'
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'

type FormValues = {
  email: string
}

export default function ForgotPassword() {
  const router = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)

  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (data: FormValues) => {
    // Request password reset link
    await authClient.forgetPassword(
      {
        email: data.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      },
      {
        onSuccess: () => {
          setIsSubmitted(true)
          toast.success('Reset link sent', {
            description: 'Check your email for reset instructions.',
          })
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='email'
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder='name@example.com'
                          {...field}
                          className='border-indigo-200 focus-visible:ring-indigo-500'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='submit'
                  className='w-full bg-indigo-600 hover:bg-indigo-700'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Sending request...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </Button>
              </form>
            </Form>
          ) : (
            <div className='space-y-4'>
              <div className='p-4 bg-indigo-50 border border-indigo-200 rounded-md text-indigo-700 text-sm'>
                Check your email for instructions to reset your password.
              </div>
              <Button
                onClick={() => router.push('/auth/login')}
                className='w-full bg-indigo-600 hover:bg-indigo-700'
              >
                Return to Login
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className='flex justify-center pt-0'>
          {!isSubmitted && (
            <Link
              href='/auth/login'
              className='text-indigo-600 hover:underline text-sm flex items-center'
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
