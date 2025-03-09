import { MongoClient } from 'mongodb'
import { betterAuth } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
//
import { BETTER_AUTH_URL, APP_URL, sendEmail } from '~/libs'

const mongoUri = process.env.MONGO_URI

if (!mongoUri) {
  throw new Error('Missing MONGO_URI in environment variables')
}

const mongodb = new MongoClient(mongoUri).db('betterAuth')

export const auth = betterAuth({
  database: mongodbAdapter(mongodb),
  baseURL: BETTER_AUTH_URL,
  trustedOrigins: [APP_URL],
  user: {
    modelName: 'users',
    additionalFields: {
      phone: { type: 'string', nullable: true, returned: true },
      isAdmin: { type: 'boolean', default: false, returned: true },
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url, token }) => {
        // Send change email verification
        sendEmail({
          to: newEmail,
          subject: 'Verify your new email',
          text: `Click the link to verify your new email: ${url}`,
        })
      },
    },
  },
  session: { modelName: 'sessions' },
  account: { modelName: 'accounts' },
  emailAndPassword: {
    enabled: true,
    disableSignUp: false, // Enable/Disable sign up
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    // Password hashing configuration
    password: {
      hash: async (password) => {
        return await Bun.password.hash(password, {
          algorithm: 'bcrypt',
          cost: 10,
        })
      },
      verify: async ({ password, hash }) => {
        return await Bun.password.verify(password, hash)
      },
    },
    // Email verification configuration
    requireEmailVerification: false,
    emailVerification: {
      sendVerificationEmail: async ({ user, url, token }) => {
        await sendEmail({
          to: user.email,
          subject: 'Verify your email',
          text: `Click the link to verify your email: ${url}`,
        })
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: 3600, // 1 hour
    },
    // Password reset configuration
    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your password',
        text: `Click the link to reset your password: ${url}`,
      })
    },
  },
})
