import '~/config/compress.config'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { MongoClient } from 'mongodb'
import { compress } from 'hono/compress'
//
import { Users } from '~/routes'
import { auth, DB } from '~/config'
import { errorHandler, notFound } from '~/middlewares'

// Initialize the Hono app with base path
const app = new Hono<{
  Variables: {
    user: typeof auth.$Infer.Session.user | null
    session: typeof auth.$Infer.Session.session | null
  }
}>({ strict: false })

// Declare global DB variable
declare global {
  var mongoDb: ReturnType<MongoClient['db']>
}

// Config MongoDB - Only connect if not in Cloudflare Workers environment
if (typeof process !== 'undefined') {
  DB().then((db) => {
    globalThis.mongoDb = db.mongoClient.db()
  })
}

// Determine the environment
const port = process.env?.PORT || 8000
const API_BASE = process.env.API_BASE || '/api/v1'

// Logger middleware
app.use(logger())

// Compress middleware
app.use(compress({ encoding: 'gzip' }))

// CORS configuration (tightened for security)
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://localhost:8000'], // Specify allowed origins (update for production)
    credentials: true,
    maxAge: 86400, // Cache preflight for 1 day
  })
)

// Home Route
app.get('/', (c) => {
  return c.json({
    message: 'Welcome to the Hono API',
  })
})

// Better-Auth - Handle all auth routes
app.all('/api/auth/*', async (c) => {
  return await auth.handler(c.req.raw)
})

// Users Route
app.route(API_BASE + '/users', Users)

// Error Handler (improved to use err)
app.onError(errorHandler)

// Not Found Handler (standardized response)
app.notFound(notFound)

// Export for both Bun and Cloudflare Workers
export default {
  port,
  fetch: app.fetch,
}
