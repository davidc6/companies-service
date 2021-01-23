import { Pool, QueryResult } from "pg"
const pool = new Pool({ query_timeout: 3000 })

export const query = async (text: string, params?: string[]): Promise<QueryResult<any>> => {
  return pool.query(text, params)
}
