'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Flower, LogOut, User, Settings, Bell } from 'lucide-react'
import { authClient } from '~/lib/auth'

export default function Dashboard() {
  const router = useRouter()
  const [user] = useState({
    name: 'Jane Doe',
    email: 'jane@example.com',
    joinedDate: 'March 2023',
  })

  const handleLogout = async () => {
    // Clear the session via Better Auth client
    await authClient.signOut()
    router.push('/auth/login')
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-indigo-50 to-white'>
      <header className='border-b border-indigo-100 bg-white'>
        <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
          <Link href='/' className='flex items-center space-x-2'>
            <Flower className='h-6 w-6 text-indigo-500' />
            <span className='font-bold text-indigo-700'>Better Auth</span>
          </Link>
          <nav className='hidden md:flex items-center space-x-6'>
            <Link href='/dashboard' className='text-indigo-700 font-medium'>
              Dashboard
            </Link>
            <Link
              href='/dashboard/profile'
              className='text-gray-600 hover:text-indigo-600'
            >
              Profile
            </Link>
            <Link
              href='/dashboard/settings'
              className='text-gray-600 hover:text-indigo-600'
            >
              Settings
            </Link>
          </nav>
          <Button
            variant='outline'
            size='icon'
            onClick={handleLogout}
            className='text-gray-600 hover:text-indigo-600'
          >
            <LogOut className='h-5 w-5' />
            <span className='sr-only'>Logout</span>
          </Button>
        </div>
      </header>

      <main className='container mx-auto px-4 py-8'>
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
              <CardDescription>
                Manage your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                <Button
                  variant='outline'
                  className='mt-4 w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50'
                >
                  Edit Profile
                </Button>
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
                <Button
                  variant='outline'
                  className='w-full justify-start border-indigo-200 text-gray-700 hover:bg-indigo-50'
                >
                  Change Password
                </Button>
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
      </main>
    </div>
  )
}
