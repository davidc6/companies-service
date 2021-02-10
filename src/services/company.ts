import { query } from "../db"

type CompanyType = {
  id?: number
  company_id: string
  name: string
  summary: string
  careers: string
  industry_id: string
  founded: number
  github: string
  blog: string
}

type PatchData = {
  [key: string]: string | number
}

const COMPANY_SELECT_FIELDS = [
  "companies.company_id",
  "companies.name",
  "companies.summary",
  "companies.careers",
  "companies.founded",
  "companies.github",
  "companies.blog",
  "industries.industry_id",
  "industries.description AS industry_description",
]

const COMPANY_INSERT_FIELDS = [
  "company_id",
  "name",
  "summary",
  "careers",
  "founded",
  "industry_id",
  "github",
  "blog",
]

const TABLE_NAME = "companies"

class Company {
  async getAll(): Promise<CompanyType[]> {
    const { rows } = await query(
      `SELECT ${COMPANY_SELECT_FIELDS.join(
        ", "
      )} FROM ${TABLE_NAME} INNER JOIN industries ON companies.industry_id=industries.industry_id ORDER BY company_id ASC LIMIT 10`
    )

    return rows
  }

  async getById(id: string): Promise<CompanyType> {
    const { rows } = await query(
      `SELECT ${COMPANY_SELECT_FIELDS.join(
        ", "
      )} FROM ${TABLE_NAME} INNER JOIN industries ON companies.industry_id=industries.industry_id WHERE company_id = $1 LIMIT 1`,
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
    const fields = `(${COMPANY_INSERT_FIELDS.join(", ")})`
    const values = `VALUES (${COMPANY_INSERT_FIELDS.map((val, index) => `$${index + 1}`).join(
      ", "
    )})`
    const returning = `RETURNING *`
    const insertQuery = `${insert} ${fields} ${values} ${returning}`

    const { company_id, name, summary, careers, industry_id, founded, github, blog } = data

    // order is important for parameterized query
    const bodyValues = [
      company_id,
      name,
      summary,
      careers,
      founded,
      industry_id,
      github,
      blog,
    ] as string[]

    const company = await query(insertQuery, bodyValues)

    const selectFrom = `SELECT ${COMPANY_SELECT_FIELDS} FROM ${TABLE_NAME}`
    const leftJoin = `LEFT JOIN industries ON companies.industry_id=industries.industry_id`
    const where = `WHERE companies.id = ${company.rows[0].id}`

    const companyResult = await query(`${selectFrom} ${leftJoin} ${where}`)

    return companyResult.rows[0]
  }
}

export default Company
