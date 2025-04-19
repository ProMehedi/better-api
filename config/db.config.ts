import { Pool } from 'pg'
import { POSTGRES_URL } from '~/libs'

if (!POSTGRES_URL) {
  throw new Error('Missing DATABASE_URL in environment variables')
}

// Create a PostgreSQL connection pool
const db = new Pool({
  connectionString: POSTGRES_URL,
})

export const initDB = async () => {
  try {
    // Test the connection
    const client = await db.connect()
    client.release()
    console.log('✅ PostgreSQL Connected')

    return { db }
  } catch (err: any) {
    console.error(`❌ PostgreSQL Connection Error: ${err.message}`)
    process.exit(1)
  }
}

export default db
