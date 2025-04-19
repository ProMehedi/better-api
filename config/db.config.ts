import { Pool } from 'pg'
import { POSTGRES_URL } from '~/libs'

if (!POSTGRES_URL) {
  throw new Error('Missing DATABASE_URL in environment variables')
}

// Create a PostgreSQL connection pool
const db = new Pool({
  connectionString: POSTGRES_URL,
})

export default db
