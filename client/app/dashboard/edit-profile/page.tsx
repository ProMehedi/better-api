'use client'

import type React from 'react'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Loader2, User } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { toast } from 'sonner'

type FormValues = {
  name: string
  email: string
  bio: string
}

export default function EditProfile() {
  const router = useRouter()
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const form = useForm<FormValues>({
    defaultValues: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      bio: 'Software developer passionate about creating beautiful user interfaces.',
    },
  })

  const { isSubmitting } = form.formState

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setAvatarPreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data: FormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast.success('Profile updated', {
        description: 'Your profile has been successfully updated.',
      })

      router.push('/dashboard/profile')
    } catch (error) {
      toast.error('Update failed', {
        description:
          'There was a problem updating your profile. Please try again.',
      })
    }
  }

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>Edit Profile</h1>
        <Link href='/dashboard/profile'>
          <Button variant='outline' size='sm' className='border-indigo-200'>
            Cancel
          </Button>
        </Link>
      </div>

      <Card className='border-indigo-200 max-w-2xl mx-auto'>
        <CardHeader>
          <CardTitle className='text-xl font-bold text-indigo-700 flex items-center'>
            <User className='mr-2 h-5 w-5' />
            Personal Information
          </CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <div className='flex flex-col items-center justify-center mb-6'>
                <Avatar className='h-24 w-24 mb-4'>
                  <AvatarImage
                    src={avatarPreview || '/placeholder.svg?height=96&width=96'}
                    alt='Profile'
                  />
                  <AvatarFallback className='bg-indigo-100 text-indigo-700 text-xl'>
                    {form
                      .watch('name')
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase() || 'JD'}
                  </AvatarFallback>
                </Avatar>

                <div className='flex items-center justify-center'>
                  <label htmlFor='avatar' className='cursor-pointer'>
                    <div className='px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md text-sm font-medium hover:bg-indigo-200 transition-colors'>
                      Change Avatar
                    </div>
                    <input
                      id='avatar'
                      type='file'
                      accept='image/*'
                      className='hidden'
                      onChange={handleAvatarChange}
                    />
                  </label>
                </div>
              </div>

              <FormField
                control={form.control}
                name='name'
                rules={{
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='John Doe'
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
                        type='email'
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
                name='bio'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <textarea
                        placeholder='Tell us about yourself'
                        {...field}
                        className='flex min-h-[80px] w-full rounded-md border border-indigo-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                      />
                    </FormControl>
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
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
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
