import { Pool, QueryResult } from "pg"
const pool = new Pool()

export const query = async (text: string, params?: string[]): Promise<QueryResult<any>> => {
  return pool.query(text, params)
}
