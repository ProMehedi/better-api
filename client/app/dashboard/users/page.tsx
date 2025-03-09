'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Badge } from '~/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  Search,
  UserPlus,
  MoreHorizontal,
  Shield,
  UserCog,
  Trash2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  User,
} from 'lucide-react'
import { toast } from 'sonner'

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2 hours ago',
    joinedDate: 'Mar 15, 2023',
  },
  {
    id: '2',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'User',
    status: 'Active',
    lastActive: '1 day ago',
    joinedDate: 'Apr 20, 2023',
  },
  {
    id: '3',
    name: 'Emily Johnson',
    email: 'emily@example.com',
    role: 'User',
    status: 'Inactive',
    lastActive: '2 weeks ago',
    joinedDate: 'Jan 10, 2023',
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'Moderator',
    status: 'Active',
    lastActive: '3 days ago',
    joinedDate: 'Feb 28, 2023',
  },
  {
    id: '5',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    role: 'User',
    status: 'Suspended',
    lastActive: '1 month ago',
    joinedDate: 'Dec 5, 2022',
  },
  {
    id: '6',
    name: 'David Lee',
    email: 'david@example.com',
    role: 'User',
    status: 'Active',
    lastActive: '5 hours ago',
    joinedDate: 'May 12, 2023',
  },
  {
    id: '7',
    name: 'Lisa Taylor',
    email: 'lisa@example.com',
    role: 'User',
    status: 'Active',
    lastActive: '1 week ago',
    joinedDate: 'Jun 8, 2023',
  },
  {
    id: '8',
    name: 'Robert Martinez',
    email: 'robert@example.com',
    role: 'Moderator',
    status: 'Active',
    lastActive: '12 hours ago',
    joinedDate: 'Jul 22, 2023',
  },
  {
    id: '9',
    name: 'Jennifer Garcia',
    email: 'jennifer@example.com',
    role: 'User',
    status: 'Inactive',
    lastActive: '3 weeks ago',
    joinedDate: 'Aug 30, 2023',
  },
  {
    id: '10',
    name: 'Thomas Anderson',
    email: 'thomas@example.com',
    role: 'User',
    status: 'Active',
    lastActive: '4 days ago',
    joinedDate: 'Sep 15, 2023',
  },
]

type UserType = (typeof mockUsers)[0]

export default function AdminUsers() {
  const router = useRouter()
  const [users, setUsers] = useState<UserType[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<keyof UserType>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [roleFilter, setRoleFilter] = useState<string | null>(null)

  // Filter and sort users
  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter ? user.status === statusFilter : true
      const matchesRole = roleFilter ? user.role === roleFilter : true

      return matchesSearch && matchesStatus && matchesRole
    })
    .sort((a, b) => {
      const fieldA = a[sortField]
      const fieldB = b[sortField]

      if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1
      if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  const handleSort = (field: keyof UserType) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleDeleteUser = () => {
    if (!selectedUser) return

    // Filter out the selected user
    setUsers(users.filter((user) => user.id !== selectedUser.id))

    toast.success('User deleted', {
      description: `${selectedUser.name} has been removed from the system.`,
    })

    setIsDeleteDialogOpen(false)
    setSelectedUser(null)
  }

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    )

    toast.success('Status updated', {
      description: `User status has been changed to ${newStatus}.`,
    })
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    )

    toast.success('Role updated', {
      description: `User role has been changed to ${newRole}.`,
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return (
          <Badge className='bg-green-500 hover:bg-green-600'>{status}</Badge>
        )
      case 'Inactive':
        return (
          <Badge variant='outline' className='text-gray-500 border-gray-300'>
            {status}
          </Badge>
        )
      case 'Suspended':
        return <Badge className='bg-red-500 hover:bg-red-600'>{status}</Badge>
      default:
        return <Badge variant='secondary'>{status}</Badge>
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'Admin':
        return (
          <Badge className='bg-indigo-600 hover:bg-indigo-700'>{role}</Badge>
        )
      case 'Moderator':
        return <Badge className='bg-blue-500 hover:bg-blue-600'>{role}</Badge>
      default:
        return <Badge variant='secondary'>{role}</Badge>
    }
  }

  const exportUsers = () => {
    // In a real app, this would generate a CSV or Excel file
    const csvHeader = 'Name,Email,Role,Status,Last Active,Joined Date\n'
    const csvData = filteredUsers
      .map((user) => {
        return `${user.name},${user.email},${user.role},${user.status},${user.lastActive},${user.joinedDate}`
      })
      .join('\n')

    const blob = new Blob([csvHeader + csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    toast.success('Export complete', {
      description: 'User data has been exported as CSV.',
    })
  }

  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h1 className='text-2xl font-bold text-gray-800'>User Management</h1>
          <p className='text-gray-500'>Manage all users in the system</p>
        </div>
        <div className='flex space-x-2'>
          <Button
            variant='outline'
            size='sm'
            className='border-indigo-200 text-indigo-700 hover:bg-indigo-50'
            onClick={exportUsers}
          >
            <Download className='mr-2 h-4 w-4' />
            Export
          </Button>
          <Button size='sm' className='bg-indigo-600 hover:bg-indigo-700'>
            <UserPlus className='mr-2 h-4 w-4' />
            Add User
          </Button>
        </div>
      </div>

      <Card className='border-indigo-200'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-xl font-bold text-indigo-700 flex items-center'>
            <Shield className='mr-2 h-5 w-5' />
            All Users
          </CardTitle>
          <CardDescription>
            Total users: {filteredUsers.length}{' '}
            {filteredUsers.length !== users.length &&
              `(filtered from ${users.length})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col md:flex-row justify-between mb-4 space-y-2 md:space-y-0 md:space-x-2'>
            <div className='relative w-full md:w-1/3'>
              <Search className='absolute left-2 top-2.5 h-4 w-4 text-gray-400' />
              <Input
                placeholder='Search users...'
                className='pl-8 border-indigo-200 focus-visible:ring-indigo-500'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className='flex space-x-2'>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='border-indigo-200'>
                    <Filter className='mr-2 h-4 w-4' />
                    Status
                    {statusFilter && (
                      <Badge className='ml-2 bg-indigo-100 text-indigo-800'>
                        {statusFilter}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter('Inactive')}>
                    Inactive
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setStatusFilter('Suspended')}
                  >
                    Suspended
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' className='border-indigo-200'>
                    <Filter className='mr-2 h-4 w-4' />
                    Role
                    {roleFilter && (
                      <Badge className='ml-2 bg-indigo-100 text-indigo-800'>
                        {roleFilter}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setRoleFilter(null)}>
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('Admin')}>
                    Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('Moderator')}>
                    Moderator
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('User')}>
                    User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className='rounded-md border border-indigo-100 overflow-hidden'>
            <Table>
              <TableHeader className='bg-indigo-50'>
                <TableRow>
                  <TableHead className='w-[250px]'>
                    <button
                      className='flex items-center font-medium text-indigo-900'
                      onClick={() => handleSort('name')}
                    >
                      User
                      {sortField === 'name' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className='ml-1 h-4 w-4' />
                        ) : (
                          <ChevronDown className='ml-1 h-4 w-4' />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className='flex items-center font-medium text-indigo-900'
                      onClick={() => handleSort('role')}
                    >
                      Role
                      {sortField === 'role' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className='ml-1 h-4 w-4' />
                        ) : (
                          <ChevronDown className='ml-1 h-4 w-4' />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className='flex items-center font-medium text-indigo-900'
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortField === 'status' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className='ml-1 h-4 w-4' />
                        ) : (
                          <ChevronDown className='ml-1 h-4 w-4' />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className='flex items-center font-medium text-indigo-900'
                      onClick={() => handleSort('lastActive')}
                    >
                      Last Active
                      {sortField === 'lastActive' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className='ml-1 h-4 w-4' />
                        ) : (
                          <ChevronDown className='ml-1 h-4 w-4' />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      className='flex items-center font-medium text-indigo-900'
                      onClick={() => handleSort('joinedDate')}
                    >
                      Joined
                      {sortField === 'joinedDate' &&
                        (sortDirection === 'asc' ? (
                          <ChevronUp className='ml-1 h-4 w-4' />
                        ) : (
                          <ChevronDown className='ml-1 h-4 w-4' />
                        ))}
                    </button>
                  </TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className='hover:bg-indigo-50/50'>
                      <TableCell className='font-medium'>
                        <div className='flex items-center space-x-3'>
                          <Avatar className='h-8 w-8'>
                            <AvatarImage
                              src={`/placeholder.svg?height=32&width=32`}
                              alt={user.name}
                            />
                            <AvatarFallback className='bg-indigo-100 text-indigo-700 text-xs'>
                              {user.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-medium'>{user.name}</div>
                            <div className='text-xs text-gray-500'>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className='text-gray-500'>
                        {user.lastActive}
                      </TableCell>
                      <TableCell className='text-gray-500'>
                        {user.joinedDate}
                      </TableCell>
                      <TableCell className='text-right'>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant='ghost' size='icon'>
                              <MoreHorizontal className='h-4 w-4' />
                              <span className='sr-only'>Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='end'>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(`/dashboard/profile?id=${user.id}`)
                              }
                            >
                              <User className='mr-2 h-4 w-4' />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <UserCog className='mr-2 h-4 w-4' />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenu>
                              <DropdownMenuTrigger className='w-full'>
                                <div className='flex items-center px-2 py-1.5 text-sm'>
                                  <Badge className='mr-2'>{user.status}</Badge>
                                  Change Status
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(user.id, 'Active')
                                  }
                                >
                                  Active
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(user.id, 'Inactive')
                                  }
                                >
                                  Inactive
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusChange(user.id, 'Suspended')
                                  }
                                >
                                  Suspended
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                              <DropdownMenuTrigger className='w-full'>
                                <div className='flex items-center px-2 py-1.5 text-sm'>
                                  <Badge className='mr-2'>{user.role}</Badge>
                                  Change Role
                                </div>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleChange(user.id, 'Admin')
                                  }
                                >
                                  Admin
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleChange(user.id, 'Moderator')
                                  }
                                >
                                  Moderator
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRoleChange(user.id, 'User')
                                  }
                                >
                                  User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className='text-red-600 focus:text-red-600'
                              onClick={() => {
                                setSelectedUser(user)
                                setIsDeleteDialogOpen(true)
                              }}
                            >
                              <Trash2 className='mr-2 h-4 w-4' />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className='h-24 text-center'>
                      No users found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete User Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='flex items-center text-red-600'>
              <AlertTriangle className='mr-2 h-5 w-5' />
              Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className='flex items-center space-x-3 p-4 bg-gray-50 rounded-md'>
              <Avatar className='h-10 w-10'>
                <AvatarImage
                  src={`/placeholder.svg?height=40&width=40`}
                  alt={selectedUser.name}
                />
                <AvatarFallback className='bg-indigo-100 text-indigo-700'>
                  {selectedUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className='font-medium'>{selectedUser.name}</div>
                <div className='text-sm text-gray-500'>
                  {selectedUser.email}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className='sm:justify-end'>
            <Button
              type='button'
              variant='outline'
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type='button'
              variant='destructive'
              onClick={handleDeleteUser}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
