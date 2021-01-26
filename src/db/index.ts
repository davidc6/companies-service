import { Pool, QueryResult } from "pg"
import dotenv from "dotenv"
dotenv.config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  query_timeout: 3000,
})

export const query = async (text: string, params?: string[]): Promise<QueryResult> => {
  return pool.query(text, params)
}
