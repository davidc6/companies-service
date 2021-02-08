import { query } from "../db"

type IndustryType = {
  id?: number
  industry_id: string
  description: string
}

const INDUSTRY_SELECT_FIELDS = ["industry_id", "description"]
const TABLE_NAME = "industries"

class Industry {
  async getAll(): Promise<IndustryType[]> {
    const { rows } = await query(`SELECT ${INDUSTRY_SELECT_FIELDS.join(", ")} FROM ${TABLE_NAME}`)

    return rows
  }
}

export default Industry
