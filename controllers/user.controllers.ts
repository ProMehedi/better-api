import { Context } from 'hono'
import { DB } from '~/config'
import { eq, and, sql } from 'drizzle-orm'
import * as schema from '~/config/schema/auth-schema'

/**
 * @api {get} /users Get All Users
 * @apiGroup Users
 * @access Private
 */
export const getUsers = async (c: Context) => {
  const users = await DB.select().from(schema.users)
  return c.json(users)
}

/**
 * @api {get} /users/:id Get Single User
 * @apiGroup Users
 * @access Private
 */
export const getUserById = async (c: Context) => {
  const id = c.req.param('id')

  const user = await DB.select()
    .from(schema.users)
    .where(eq(schema.users.id, id))
    .limit(1)
    .then(users => users[0])

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
  try {
    const user = c.get('user')
    const body = await c.req.json()

    // Create an object to hold our updates
    const updates: Partial<typeof schema.users.$inferInsert> = {}

    // Only add fields to the update if they exist in the request body
    if (body.name !== undefined && body.name !== '') {
      updates.name = body.name.trim()
    }

    if (body.phone !== undefined && body.phone !== '') {
      // Simple phone validation
      if (!/^\+?[\d\s-]{7,15}$/.test(body.phone)) {
        return c.json(
          {
            success: false,
            message: 'Invalid phone number format',
          },
          400
        )
      }
      updates.phone = body.phone.trim()
    }

    if (body.image !== undefined && body.image !== '') {
      updates.image = body.image.trim()
    }

    // Add updatedAt timestamp
    updates.updatedAt = new Date()

    // If no fields were provided, return early
    if (Object.keys(updates).length === 0) {
      return c.json(
        {
          success: false,
          message: 'No fields to update',
        },
        400
      )
    }

    // Update the user's profile with only the provided fields
    const updatedUser = await DB.update(schema.users)
      .set(updates)
      .where(eq(schema.users.id, user.id))
      .returning()
      .then(users => users[0])

    if (!updatedUser) {
      return c.json(
        {
          success: false,
          message: 'User not found or update failed',
        },
        404
      )
    }

    return c.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    })
  } catch (error) {
    console.error('Profile update error:', error)
    return c.json(
      {
        success: false,
        message: 'Failed to update profile',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
}

/**
 * @api {get} /users/profile Get User Profile
 * @apiGroup Users
 * @access Private
 */
export const getProfile = async (c: Context) => {
  const user = c.get('user')

  const profile = await DB.select()
    .from(schema.users)
    .where(eq(schema.users.id, user.id))
    .limit(1)
    .then(users => users[0])

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

/**
 * @api {delete} /users/:id Delete User
 * @apiGroup Users
 * @access Private
 */
export const deleteUser = async (c: Context) => {
  const id = c.req.param('id')

  try {
    // Start a transaction for atomic operations
    const tx = await DB.transaction(async trx => {
      // First delete related sessions for the user
      await trx.delete(schema.sessions).where(eq(schema.sessions.userId, id))

      // Delete related accounts
      await trx.delete(schema.accounts).where(eq(schema.accounts.userId, id))

      // Then delete the user
      const deletedUsers = await trx
        .delete(schema.users)
        .where(eq(schema.users.id, id))
        .returning()

      if (deletedUsers.length === 0) {
        throw new Error('User not found')
      }

      return deletedUsers[0]
    })

    return c.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    console.error('Delete user error:', error)
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error'

    if (errorMessage === 'User not found') {
      return c.json(
        {
          success: false,
          message: 'User not found',
          error: 'No user found with the provided ID',
        },
        404
      )
    }

    return c.json(
      {
        success: false,
        message: 'Failed to delete user',
        error: errorMessage,
      },
      500
    )
  }
}
