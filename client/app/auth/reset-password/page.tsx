'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Flower,
  CheckCircle,
} from 'lucide-react'
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
  FormDescription,
} from '~/components/ui/form'
import { Progress } from '~/components/ui/progress'

type FormValues = {
  newPassword: string
  confirmPassword: string
}

// Component that uses searchParams
function ResetPasswordForm() {
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [passwordStrength, setPasswordStrength] = React.useState(0)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const form = useForm<FormValues>({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const { isSubmitting } = form.formState
  const newPassword = form.watch('newPassword')

  // Calculate password strength
  const calculatePasswordStrength = (password: string) => {
    if (!password) return 0

    let strength = 0

    // Length check
    if (password.length >= 8) strength += 25

    // Contains lowercase
    if (/[a-z]/.test(password)) strength += 25

    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25

    // Contains number or special char
    if (/[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) strength += 25

    return strength
  }

  // Update password strength when password changes
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStrength = calculatePasswordStrength(e.target.value)
    setPasswordStrength(newStrength)
    form.setValue('newPassword', e.target.value)
  }

  const getStrengthLabel = (strength: number) => {
    if (strength === 0) return 'No password'
    if (strength <= 25) return 'Weak'
    if (strength <= 50) return 'Fair'
    if (strength <= 75) return 'Good'
    return 'Strong'
  }

  const getStrengthColor = (strength: number) => {
    if (strength === 0) return 'bg-gray-200'
    if (strength <= 25) return 'bg-red-500'
    if (strength <= 50) return 'bg-yellow-500'
    if (strength <= 75) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const onSubmit = async (data: FormValues) => {
    if (!token) return

    // Check if passwords match
    if (data.newPassword !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      })
      return
    }

    // Reset password
    await authClient.resetPassword(
      {
        token: token,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          setIsSuccess(true)

          toast.success('Password reset successful', {
            description:
              'Your password has been reset. You can now log in with your new password.',
          })

          // Redirect to login after 3 seconds
          setTimeout(() => {
            router.push('/auth/login')
          }, 3000)
        },
        onError: () => {
          toast.error('Password reset failed', {
            description:
              'There was a problem resetting your password. Please try again or request a new reset link.',
          })
        },
      }
    )
  }

  // If no token is provided, show an error
  if (!token && !isSuccess) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4'>
        <Card className='w-full max-w-md border-indigo-200'>
          <CardHeader className='text-center'>
            <div className='mx-auto bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2'>
              <Flower className='h-6 w-6 text-indigo-500' />
            </div>
            <CardTitle className='text-2xl font-bold text-indigo-700'>
              Invalid Reset Link
            </CardTitle>
            <CardDescription>
              The password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-center text-muted-foreground'>
              Please request a new password reset link to continue.
            </p>
            <Link href='/forgot-password' className='w-full block'>
              <Button className='w-full bg-indigo-600 hover:bg-indigo-700'>
                Request New Link
              </Button>
            </Link>
          </CardContent>
          <CardFooter className='flex justify-center'>
            <Link
              href='/login'
              className='text-indigo-600 hover:underline text-sm flex items-center'
            >
              <ArrowLeft className='mr-1 h-3 w-3' />
              Back to login
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4'>
        <Card className='w-full max-w-md border-indigo-200'>
          <CardHeader className='text-center'>
            <div className='mx-auto bg-green-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2'>
              <CheckCircle className='h-6 w-6 text-green-500' />
            </div>
            <CardTitle className='text-2xl font-bold text-green-700'>
              Password Reset Successful
            </CardTitle>
            <CardDescription>
              Your password has been reset successfully.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <p className='text-center text-muted-foreground'>
              You will be redirected to the login page shortly.
            </p>
            <div className='flex flex-col items-center justify-center gap-3'>
              <Button
                className='w-full bg-indigo-600 hover:bg-indigo-700'
                disabled
              >
                <Loader2 className='h-4 w-4 animate-spin' />
                Redirecting, please wait...
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4'>
      <Card className='w-full max-w-md border-indigo-200'>
        <CardHeader className='text-center'>
          <div className='mx-auto bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2'>
            <Lock className='h-6 w-6 text-indigo-500' />
          </div>
          <CardTitle className='text-2xl font-bold text-indigo-700'>
            Reset Password
          </CardTitle>
          <CardDescription>
            Create a new password for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='newPassword'
                rules={{
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
                    message:
                      'Password must include at least one uppercase letter, one lowercase letter, and one number or special character',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <div className='relative'>
                      <FormControl>
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          placeholder='Enter your new password'
                          {...field}
                          onChange={onPasswordChange}
                          className='border-indigo-200 focus-visible:ring-indigo-500 pr-10'
                        />
                      </FormControl>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 h-full px-3 py-2 text-gray-400'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                        <span className='sr-only'>
                          {showNewPassword ? 'Hide password' : 'Show password'}
                        </span>
                      </Button>
                    </div>
                    <div className='mt-2'>
                      <div className='flex justify-between mb-1 text-xs'>
                        <span>Password strength:</span>
                        <span
                          className={
                            passwordStrength === 0
                              ? 'text-gray-500'
                              : passwordStrength <= 25
                              ? 'text-red-500'
                              : passwordStrength <= 50
                              ? 'text-yellow-500'
                              : passwordStrength <= 75
                              ? 'text-blue-500'
                              : 'text-green-500'
                          }
                        >
                          {getStrengthLabel(passwordStrength)}
                        </span>
                      </div>
                      <Progress
                        value={passwordStrength}
                        className={`h-1 ${getStrengthColor(passwordStrength)}`}
                      />
                    </div>
                    <FormDescription className='text-xs mt-2'>
                      Password must be at least 8 characters and include
                      uppercase, lowercase, and a number or special character.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='confirmPassword'
                rules={{
                  required: 'Please confirm your new password',
                  validate: (value) =>
                    value === newPassword || 'Passwords do not match',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <div className='relative'>
                      <FormControl>
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder='Confirm your new password'
                          {...field}
                          className='border-indigo-200 focus-visible:ring-indigo-500 pr-10'
                        />
                      </FormControl>
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        className='absolute right-0 top-0 h-full px-3 py-2 text-gray-400'
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                        <span className='sr-only'>
                          {showConfirmPassword
                            ? 'Hide password'
                            : 'Show password'}
                        </span>
                      </Button>
                    </div>
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
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <Link
            href='/login'
            className='text-indigo-600 hover:underline text-sm flex items-center'
          >
            <ArrowLeft className='mr-1 h-3 w-3' />
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

// Main exported component wrapped in Suspense
export default function ResetPassword() {
  return (
    <Suspense
      fallback={
        <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center p-4'>
          <div className='text-center'>
            <Loader2 className='h-8 w-8 animate-spin mx-auto text-indigo-500' />
            <p className='mt-2 text-indigo-700'>Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
