import { Context } from 'hono'
import { DB } from '~/config'

/**
 * @api {get} /users Get All Users
 * @apiGroup Users
 * @access Private
 */
export const getUsers = async (c: Context) => {
  const { rows: users } = await DB.query('SELECT * FROM users')
  return c.json(users)
}

/**
 * @api {get} /users/:id Get Single User
 * @apiGroup Users
 * @access Private
 */
export const getUserById = async (c: Context) => {
  const id = c.req.param('id')

  const { rows } = await DB.query('SELECT * FROM users WHERE id = $1', [id])
  const user = rows[0]

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

    // Create an array to hold our query parts and values
    const updateParts: string[] = []
    const values: any[] = []
    let paramCount = 1

    // Only add fields to the update if they exist in the request body
    if (body.name !== undefined && body.name !== '') {
      updateParts.push(`name = $${paramCount}`)
      values.push(body.name.trim())
      paramCount++
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
      updateParts.push(`phone = $${paramCount}`)
      values.push(body.phone.trim())
      paramCount++
    }

    if (body.image !== undefined && body.image !== '') {
      updateParts.push(`image = $${paramCount}`)
      values.push(body.image.trim())
      paramCount++
    }

    // Add updatedAt timestamp
    updateParts.push(`"updatedAt" = NOW()`)

    // If no fields were provided, return early
    if (values.length === 0) {
      return c.json(
        {
          success: false,
          message: 'No fields to update',
        },
        400
      )
    }

    // Add user ID as the last parameter
    values.push(user.id)

    // Update the user's profile with only the provided fields
    const query = `
      UPDATE users 
      SET ${updateParts.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `

    const { rows } = await DB.query(query, values)

    if (rows.length === 0) {
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
      data: rows[0],
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

  const { rows } = await DB.query('SELECT * FROM users WHERE id = $1', [
    user.id,
  ])
  const profile = rows[0]

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
    await DB.query('BEGIN')

    // First delete related sessions for the user
    await DB.query('DELETE FROM sessions WHERE "userId" = $1', [id])

    // Delete related accounts
    await DB.query('DELETE FROM accounts WHERE "userId" = $1', [id])

    // Then delete the user
    const { rowCount } = await DB.query('DELETE FROM users WHERE id = $1', [id])

    if (rowCount === 0) {
      await DB.query('ROLLBACK')
      return c.json(
        {
          success: false,
          message: 'User not found',
          error: 'No user found with the provided ID',
        },
        404
      )
    }

    await DB.query('COMMIT')
    return c.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    await DB.query('ROLLBACK')
    console.error('Delete user error:', error)
    return c.json(
      {
        success: false,
        message: 'Failed to delete user',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      500
    )
  }
}
