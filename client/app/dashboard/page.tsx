'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { User, Settings, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

export default function Dashboard() {
  const [user] = useState({
    name: 'Jane Doe',
    email: 'jane@example.com',
    joinedDate: 'March 2023',
  })

  return (
    <>
      <h1 className='text-2xl font-bold text-gray-800 mb-6'>
        Welcome back, {user.name}!
      </h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card className='border-indigo-200'>
          <CardHeader>
            <CardTitle className='text-indigo-700 flex items-center'>
              <User className='mr-2 h-5 w-5' />
              Profile
            </CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='flex flex-col items-center mb-4'>
              <Avatar className='h-20 w-20 mb-2'>
                <AvatarImage
                  src='/placeholder.svg?height=80&width=80'
                  alt={user.name}
                />
                <AvatarFallback className='bg-indigo-100 text-indigo-700 text-xl'>
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className='space-y-2'>
              <p className='text-sm text-gray-600'>
                <span className='font-medium'>Name:</span> {user.name}
              </p>
              <p className='text-sm text-gray-600'>
                <span className='font-medium'>Email:</span> {user.email}
              </p>
              <p className='text-sm text-gray-600'>
                <span className='font-medium'>Member since:</span>{' '}
                {user.joinedDate}
              </p>
              <Link href='/dashboard/profile' className='w-full block'>
                <Button
                  variant='outline'
                  className='mt-4 w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                >
                  View Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className='border-indigo-200'>
          <CardHeader>
            <CardTitle className='text-indigo-700 flex items-center'>
              <Settings className='mr-2 h-5 w-5' />
              Account Settings
            </CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Link href='/dashboard/change-password' className='w-full block'>
                <Button
                  variant='outline'
                  className='w-full justify-start border-indigo-200 text-gray-700 hover:bg-indigo-50'
                >
                  Change Password
                </Button>
              </Link>
              <Button
                variant='outline'
                className='w-full justify-start border-indigo-200 text-gray-700 hover:bg-indigo-50'
              >
                Two-Factor Authentication
              </Button>
              <Button
                variant='outline'
                className='w-full justify-start border-indigo-200 text-gray-700 hover:bg-indigo-50'
              >
                Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className='border-indigo-200'>
          <CardHeader>
            <CardTitle className='text-indigo-700 flex items-center'>
              <Bell className='mr-2 h-5 w-5' />
              Notifications
            </CardTitle>
            <CardDescription>Recent activity and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <div className='p-3 bg-indigo-50 rounded-md border border-indigo-100'>
                <p className='text-sm font-medium text-indigo-700'>
                  Welcome to Better Auth!
                </p>
                <p className='text-xs text-gray-600 mt-1'>
                  Thank you for joining our platform.
                </p>
              </div>
              <div className='p-3 bg-gray-50 rounded-md border border-gray-100'>
                <p className='text-sm font-medium text-gray-700'>
                  Profile created successfully
                </p>
                <p className='text-xs text-gray-600 mt-1'>
                  Your profile has been set up.
                </p>
              </div>
              <Button
                variant='outline'
                className='w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50'
              >
                View All Notifications
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
