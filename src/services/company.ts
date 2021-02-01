import { query } from "../db"

type CompanyType = {
  id?: number
  company_id: string
  name: string
  summary: string
  careers: string
  industry: string
  founded: number
  github: string
  blog: string
}

type PatchData = {
  [key: string]: string | number
}

const COMPANY_SELECT_FIELDS = [
  "company_id",
  "name",
  "summary",
  "careers",
  "industry",
  "founded",
  "github",
  "blog",
]

const TABLE_NAME = "companies"

class Company {
  async getAll(): Promise<CompanyType[]> {
    const { rows } = await query(
      `SELECT ${COMPANY_SELECT_FIELDS.join(
        ", "
      )} FROM ${TABLE_NAME} ORDER BY company_id ASC LIMIT 10`
    )

    return rows
  }

  async getById(id: string): Promise<CompanyType> {
    const { rows } = await query(
      `SELECT ${COMPANY_SELECT_FIELDS.join(", ")} FROM ${TABLE_NAME} WHERE company_id = $1 LIMIT 1`,
      [id]
    )

    return rows[0]
  }

  private createPartPatchQuery(id: string, body: PatchData) {
    const fields = Object.keys(body)
    const values: (string | number)[] = Object.values(body)

    values.push(id)
    const query = fields.map((field, index) => {
      return `${field} = $${index + 1}`
    })

    return [query, values]
  }

  async updateById(id: string, data: PatchData): Promise<CompanyType> {
    const [setQuery, values] = this.createPartPatchQuery(id, data)

    const q = `UPDATE ${TABLE_NAME} SET ${setQuery} WHERE company_id = $${values.length}`
    const { rows } = await query(q, values as string[])

    return rows[0]
  }

  async deleteById(id: string): Promise<void> {
    await query(`DELETE FROM ${TABLE_NAME} WHERE company_id = $1`, [id])
  }

  async create(data: CompanyType): Promise<CompanyType> {
    const insert = `INSERT INTO ${TABLE_NAME}`
    const fields = `(${COMPANY_SELECT_FIELDS.join(", ")})`
    const values = `VALUES (${COMPANY_SELECT_FIELDS.map((val, index) => `$${index + 1}`).join(
      ", "
    )})`
    const returning = `RETURNING ${COMPANY_SELECT_FIELDS.join(", ")}`
    const q = `${insert} ${fields} ${values} ${returning}`

    const { company_id, name, summary, careers, industry, founded, github, blog } = data
    const bodyValues = [
      company_id,
      name,
      summary,
      careers,
      industry,
      founded,
      github,
      blog,
    ] as string[]

    const company = await query(q, bodyValues)

    return company.rows[0]
  }
}

export default Company
