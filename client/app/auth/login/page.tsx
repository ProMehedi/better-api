'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
//
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
import { ArrowLeft, Flower, Loader2 } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { authClient } from '~/lib/auth'

type FormValues = {
  email: string
  password: string
}

export default function Login() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const { isSubmitting } = form.formState

  const onSubmit = async (data: FormValues) => {
    // Sign in with email and password
    await authClient.signIn.email(data, {
      onSuccess: () => {
        router.push(callbackUrl)
        toast.success('Welcome back!', {
          description: 'You have successfully logged in.',
        })
      },
      onError: ({ error }) => {
        toast.error('Login failed', {
          description: 'Invalid email or password. Please try again.',
        })
      },
    })
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-md border-indigo-200'>
        <CardHeader className='text-center'>
          <div className='mx-auto bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2'>
            <Flower className='h-6 w-6 text-indigo-500' />
          </div>
          <CardTitle className='text-2xl font-bold text-indigo-700'>
            Login
          </CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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

              <FormField
                control={form.control}
                name='password'
                rules={{
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <div className='flex items-center justify-between'>
                      <FormLabel>Password</FormLabel>
                      <Link
                        href='/auth/forgot-password'
                        className='text-xs text-indigo-600 hover:underline'
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        type='password'
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
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex flex-col space-y-4 pt-0'>
          <div className='text-center text-sm'>
            Don&apos;t have an account?{' '}
            <Link
              href='/auth/register'
              className='text-indigo-600 hover:underline'
            >
              Register
            </Link>
          </div>
          <Link
            href='/'
            className='text-indigo-600 hover:underline text-sm flex items-center justify-center'
          >
            <ArrowLeft className='mr-1 h-3 w-3' />
            Back to home
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
