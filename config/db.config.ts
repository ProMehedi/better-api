import { Pool } from 'pg'
import { drizzle } from 'drizzle-orm/node-postgres'
import { DATABASE_URL } from '~/libs'
import {
  accounts,
  sessions,
  users,
  verification,
} from '~/config/schema/auth-schema'

if (!DATABASE_URL) {
  throw new Error('Missing DATABASE_URL in environment variables')
}

// Create a PostgreSQL connection pool
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Create a Drizzle ORM instance with the PostgreSQL connection pool
const db = drizzle({
  client: pool,
  schema: {
    accounts,
    sessions,
    users,
    verification,
    // Define your schema here if needed
  },
})

export const initDB = async () => {
  try {
    // Test the connection
    const client = await pool.connect()
    client.release()
    console.log('✅ PostgreSQL Connected')

    return { db }
  } catch (err: any) {
    console.error(`❌ PostgreSQL Connection Error: ${err.message}`)
    process.exit(1)
  }
}

export default db
