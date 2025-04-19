import { Hono } from 'hono'
//
import { getUsers, getUserById, getProfile, editProfile } from '~/controllers'
import { isAdmin, protect } from '~/middlewares'

const users = new Hono()

// Get All Users
users.get('/', isAdmin, getUsers)

// Get User Profile
users.get('/profile', protect, getProfile)

// // Edit User Profile
users.put('/profile', protect, editProfile)

// // Get Single User
users.get('/:id', protect, getUserById)

export default users
