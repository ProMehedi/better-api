export const EMAILIT_API_KEY = process.env.EMAILIT_API_KEY
export const EMAILIT_API_URL = process.env.EMAILIT_API_URL
export const FROM_EMAIL = process.env.FROM_EMAIL
export const FROM_NAME = process.env.FROM_NAME

// Better Auth
export const APP_URL = process.env.APP_URL || 'http://localhost:3000'
export const BETTER_AUTH_URL =
  process.env.API_URL || 'http://localhost:8000/api/auth'

// Postgres
export const POSTGRES_HOST = process.env.POSTGRES_HOST
export const POSTGRES_PORT = process.env.POSTGRES_PORT
export const POSTGRES_USER = process.env.POSTGRES_USER
export const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD
export const POSTGRES_DB = process.env.POSTGRES_DB
export const POSTGRES_URL = `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`
