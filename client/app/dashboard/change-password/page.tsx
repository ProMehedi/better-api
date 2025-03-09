'use client'

import React from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react'
//
import { authClient } from '~/lib/auth'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Progress } from '~/components/ui/progress'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '~/components/ui/form'

type FormValues = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ChangePassword() {
  const router = useRouter()
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [passwordStrength, setPasswordStrength] = React.useState(0)

  const form = useForm<FormValues>({
    defaultValues: {
      currentPassword: '',
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
    // Check if passwords match
    if (data.newPassword !== data.confirmPassword) {
      form.setError('confirmPassword', {
        type: 'manual',
        message: 'Passwords do not match',
      })
      return
    }

    // Change password
    await authClient.changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          toast.success('Password updated', {
            description: 'Your password has been successfully changed.',
          })
          router.push('/dashboard/profile')
        },
        onError: () => {
          toast.error('Update failed', {
            description:
              'There was a problem updating your password. Please try again.',
          })
        },
      }
    )
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Change Password</h1>
        <Link href='/dashboard/profile'>
          <Button variant='outline' size='sm' className='border-indigo-200'>
            Cancel
          </Button>
        </Link>
      </div>

      <Card className='border-indigo-200 max-w-md mx-auto'>
        <CardHeader>
          <CardTitle className='text-xl font-bold text-indigo-700 flex items-center'>
            <Lock className='mr-2 h-5 w-5' />
            Security Settings
          </CardTitle>
          <CardDescription>Update your account password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='currentPassword'
                rules={{
                  required: 'Current password is required',
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <div className='relative'>
                      <FormControl>
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          placeholder='Enter your current password'
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
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                        <span className='sr-only'>
                          {showCurrentPassword
                            ? 'Hide password'
                            : 'Show password'}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <div className='flex justify-end space-x-2'>
                <Link href='/dashboard/profile'>
                  <Button
                    type='button'
                    variant='outline'
                    className='border-indigo-200'
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type='submit'
                  className='bg-indigo-600 hover:bg-indigo-700'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Updating...
                    </>
                  ) : (
                    'Update Password'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
