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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Briefcase,
  Edit,
  Shield,
} from 'lucide-react'

export default function Profile() {
  const [user] = useState({
    name: 'Jane Doe',
    email: 'jane@example.com',
    joinedDate: 'March 2023',
    location: 'San Francisco, CA',
    occupation: 'Software Engineer',
    bio: 'Software developer passionate about creating beautiful user interfaces and solving complex problems. I love working with React, TypeScript, and Next.js.',
    skills: ['React', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind CSS'],
    socialLinks: {
      github: 'github.com/janedoe',
      twitter: 'twitter.com/janedoe',
      linkedin: 'linkedin.com/in/janedoe',
    },
  })

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>My Profile</h1>
        <div className='flex space-x-2'>
          <Link href='/dashboard/edit-profile'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center border-indigo-200 text-indigo-700 hover:bg-indigo-50'
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit Profile
            </Button>
          </Link>
          <Link href='/dashboard/change-password'>
            <Button
              variant='outline'
              size='sm'
              className='flex items-center border-indigo-200 text-indigo-700 hover:bg-indigo-50'
            >
              <Shield className='mr-2 h-4 w-4' />
              Security
            </Button>
          </Link>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div className='md:col-span-1'>
          <Card className='border-indigo-200'>
            <CardContent className='pt-6'>
              <div className='flex flex-col items-center'>
                <Avatar className='h-24 w-24 mb-4'>
                  <AvatarImage
                    src='/placeholder.svg?height=96&width=96'
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
                <h2 className='text-xl font-bold text-gray-800'>{user.name}</h2>
                <p className='text-gray-500 text-sm'>{user.occupation}</p>
                <p className='text-gray-500 text-sm flex items-center mt-1'>
                  <MapPin className='h-3 w-3 mr-1' />
                  {user.location}
                </p>
              </div>

              <div className='mt-6 space-y-3'>
                <div className='flex items-start'>
                  <Mail className='h-5 w-5 text-indigo-500 mr-3 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-gray-700'>Email</p>
                    <p className='text-sm text-gray-600'>{user.email}</p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <Calendar className='h-5 w-5 text-indigo-500 mr-3 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      Member Since
                    </p>
                    <p className='text-sm text-gray-600'>{user.joinedDate}</p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <Briefcase className='h-5 w-5 text-indigo-500 mr-3 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-gray-700'>
                      Occupation
                    </p>
                    <p className='text-sm text-gray-600'>{user.occupation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='md:col-span-2'>
          <Tabs defaultValue='about' className='w-full'>
            <TabsList className='grid w-full grid-cols-3 bg-indigo-50'>
              <TabsTrigger value='about'>About</TabsTrigger>
              <TabsTrigger value='skills'>Skills</TabsTrigger>
              <TabsTrigger value='social'>Social</TabsTrigger>
            </TabsList>
            <TabsContent value='about'>
              <Card className='border-indigo-200'>
                <CardHeader>
                  <CardTitle className='text-indigo-700'>About Me</CardTitle>
                  <CardDescription>
                    Personal information and bio
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-700 whitespace-pre-line'>
                    {user.bio}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='skills'>
              <Card className='border-indigo-200'>
                <CardHeader>
                  <CardTitle className='text-indigo-700'>Skills</CardTitle>
                  <CardDescription>
                    Technical skills and expertise
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='flex flex-wrap gap-2'>
                    {user.skills.map((skill, index) => (
                      <span
                        key={index}
                        className='px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm'
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value='social'>
              <Card className='border-indigo-200'>
                <CardHeader>
                  <CardTitle className='text-indigo-700'>
                    Social Links
                  </CardTitle>
                  <CardDescription>
                    Connect with me on social platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='space-y-4'>
                    {Object.entries(user.socialLinks).map(
                      ([platform, link]) => (
                        <div key={platform} className='flex items-center'>
                          <div className='w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center mr-3'>
                            <span className='text-indigo-700 font-medium uppercase'>
                              {platform[0]}
                            </span>
                          </div>
                          <div>
                            <p className='text-sm font-medium text-gray-700 capitalize'>
                              {platform}
                            </p>
                            <a
                              href={`https://${link}`}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-sm text-indigo-600 hover:underline'
                            >
                              {link}
                            </a>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className='border-indigo-200 mt-6'>
            <CardHeader>
              <CardTitle className='text-indigo-700'>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                <div className='flex'>
                  <div className='mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100'>
                    <User className='h-5 w-5 text-indigo-700' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Profile Updated</p>
                    <p className='text-xs text-gray-500'>
                      You updated your profile information
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>2 days ago</p>
                  </div>
                </div>
                <div className='flex'>
                  <div className='mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100'>
                    <Shield className='h-5 w-5 text-indigo-700' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Password Changed</p>
                    <p className='text-xs text-gray-500'>
                      You successfully changed your password
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>1 week ago</p>
                  </div>
                </div>
                <div className='flex'>
                  <div className='mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100'>
                    <Mail className='h-5 w-5 text-indigo-700' />
                  </div>
                  <div>
                    <p className='text-sm font-medium'>Email Verified</p>
                    <p className='text-xs text-gray-500'>
                      Your email address has been verified
                    </p>
                    <p className='text-xs text-gray-400 mt-1'>2 weeks ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
