import { createAuthClient } from 'better-auth/react' // make sure to import from better-auth/react

export const authClient = createAuthClient({
  baseURL: 'http://localhost:8000/api/auth', // The base URL of the API
})

export const { signIn, signUp, useSession } = authClient
