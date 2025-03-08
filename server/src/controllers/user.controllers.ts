import { Context } from 'hono'
import { ObjectId } from 'mongodb'

/**
 * @api {get} /users Get All Users
 * @apiGroup Users
 * @access Private
 */
export const getUsers = async (c: Context) => {
  const users = await mongoDb.collection('users').find().toArray()
  return c.json(users)
}

/**
 * @api {get} /users/:id Get Single User
 * @apiGroup Users
 * @access Private
 */
export const getUserById = async (c: Context) => {
  const id = c.req.param('id')

  const user = await mongoDb
    .collection('users')
    .findOne({ _id: new ObjectId(id) })

  if (!user) {
    return c.json(
      {
        success: false,
        message: 'User not found',
        error: 'No user found with the provided ID',
      },
      404
    )
  }

  return c.json(user)
}

/**
 * @api {put} /users/profile Edit User Profile
 * @apiGroup Users
 * @access Private
 */
export const editProfile = async (c: Context) => {
  const user = c.get('user')
  const body = await c.req.json()

  // Create an update object with only the fields that were provided
  const updateFields: Record<string, any> = {}

  // Only add fields to the update if they exist in the request body
  if (body.name !== '') updateFields.name = body.name
  if (body.phone !== '') updateFields.phone = body.phone
  if (body.image !== '') updateFields.image = body.image

  // If no fields were provided, return early
  if (Object.keys(updateFields).length === 0) {
    return c.json(
      {
        success: false,
        message: 'No fields to update',
      },
      400
    )
  }

  // Update the user's profile with only the provided fields
  const updatedProfile = await mongoDb.collection('users').updateOne(
    { _id: new ObjectId(user.id) },
    {
      $set: updateFields,
      $currentDate: { lastModified: true },
    }
  )

  return c.json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedProfile,
  })
}

/**
 * @api {get} /users/profile Get User Profile
 * @apiGroup Users
 * @access Private
 */
export const getProfile = async (c: Context) => {
  const user = c.get('user')

  const profile = await mongoDb
    .collection('users')
    .findOne({ _id: new ObjectId(user.id) })

  if (!profile) {
    return c.json(
      {
        success: false,
        message: 'Profile not found',
        error: 'No profile found for the user',
      },
      404
    )
  }

  return c.json(profile)
}
