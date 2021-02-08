import { expect } from "chai"
import { spawn, ChildProcessWithoutNullStreams } from "child_process"
import fetch from "node-fetch"
import {} from "dotenv/config"
import request from "supertest"
import sinon from "sinon"
import app from "../../src/index"
import * as DB from "../../src/db"

const serverStart: () => Promise<{ server: ChildProcessWithoutNullStreams; url: string }> = () =>
  new Promise((resolve, reject) => {
    const server = spawn("node", ["../../dist/.bin/www.js"], {
      env: Object.assign({}, process.env, { PORT: 0 }),
      cwd: __dirname,
    })

    server.stdout.once("data", async (data) => {
      const msg = data.toString().trim()
      const url = /Server running at (.+)$/.exec(msg)[1]
      resolve({ server, url })
    })

    server.stderr.on("data", (data) => {
      console.error("Error", data.toString())
    })
  })

describe.skip("Routes integration", () => {
  it("GET /", async () => {
    const { server, url } = await serverStart()

    try {
      const promise = await fetch(`${url}`)
      const response = await promise.json()

      expect(response).to.deep.equal({
        current_url: `${url}`,
        all_companies_url: `${url}/companies`,
        company_url: `${url}/companies/{company_id}`,
      })

      server.kill()
    } catch (err) {
      server.kill()
      throw err
    }
  })

  it("GET /companies", async () => {
    const { server, url } = await serverStart()

    try {
      const promise = await fetch(`${url}/companies`)

      expect(promise.status).to.equal(200)

      server.kill()
    } catch (err) {
      server.kill()
      throw err
    }
  })
})

describe("Routes integration", () => {
  const sandbox = sinon.createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  describe("/", () => {
    it("return all API urls", async () => {
      await request(app).get("/").expect(200)
    })
  })

  describe("/companies", () => {
    describe("GET", () => {
      it("should 200", async () => {
        sandbox.stub(DB, "query").resolves({ rows: [] })
        await request(app).get("/companies").expect(200)
      })

      it("should return a list of data", async () => {
        sandbox.stub(DB, "query").resolves({ rows: [{ one: "one" }, { two: "two" }] })

        const response = await request(app).get("/companies")
        expect(response.body).to.deep.equal([{ one: "one" }, { two: "two" }])
      })

      it("should construct the correct SQL query", async () => {
        const dbStub = sandbox.stub(DB, "query").resolves({ rows: [] })
        await request(app).get("/companies")

        expect(dbStub.firstCall.args[0]).to.equal(
          "SELECT company_id, name, summary, careers, industry, founded, github, blog FROM companies ORDER BY company_id ASC LIMIT 10"
        )
      })

      it("should 500 if query fails", async () => {
        sandbox.stub(DB, "query").rejects()
        await request(app).get("/companies").expect(500)
      })
    })

    describe("POST", () => {
      it("should construct the correct SQL query and pass values", async () => {
        const obj = {
          company_id: "id",
          name: "name",
          summary: "summary",
          careers: "careers",
          industry: "industry",
          founded: 2021,
          github: "github",
          blog: "blog",
        }

        const dbStub = sandbox.stub(DB, "query").resolves({ rows: [obj] })

        await request(app).post("/companies").send(obj).expect(201)

        const queryPartOne =
          "INSERT INTO companies (company_id, name, summary, careers, industry, founded, github, blog)"
        const queryPartTwo = "VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"
        const queryPartThree =
          "RETURNING company_id, name, summary, careers, industry, founded, github, blog"

        expect(dbStub.firstCall.args[0]).to.equal(
          `${queryPartOne} ${queryPartTwo} ${queryPartThree}`
        )
        expect(dbStub.firstCall.args[1]).to.deep.equal([
          "id",
          "name",
          "summary",
          "careers",
          "industry",
          2021,
          "github",
          "blog",
        ])
      })

      it("should 201 if request successful", async () => {
        const obj = {
          company_id: "id",
          name: "name",
          summary: "summary",
          careers: "careers",
          industry: "industry",
          founded: 2021,
          github: "github",
          blog: "blog",
        }

        sandbox.stub(DB, "query").resolves({ rows: [obj] })

        await request(app).post("/companies").send(obj).expect(201)
      })

      it("should return a response if request successful", async () => {
        const obj = {
          company_id: "id",
          name: "name",
          summary: "summary",
          careers: "careers",
          industry: "industry",
          founded: 2021,
          github: "github",
          blog: "blog",
        }

        sandbox.stub(DB, "query").resolves({ rows: [obj] })

        const response = await request(app).post("/companies").send(obj)
        expect(response.body).to.deep.equal(obj)
      })

      it("should return a response if request fails", async () => {
        const obj = {
          company_id: "id",
          name: "name",
          summary: "summary",
          careers: "careers",
          industry: "industry",
          founded: 2021,
          github: "github",
          blog: "blog",
        }

        sandbox.stub(DB, "query").rejects()

        await request(app).post("/companies").send(obj).expect(500)
      })
    })
  })

  describe("/industries", () => {
    describe("GET", () => {
      it("should 200", async () => {
        sandbox.stub(DB, "query").resolves({ rows: [] })
        await request(app).get("/industries").expect(200)
      })

      it("should return a list of data", async () => {
        sandbox.stub(DB, "query").resolves({ rows: [{ one: "one" }, { two: "two" }] })

        const response = await request(app).get("/industries")
        expect(response.body).to.deep.equal([{ one: "one" }, { two: "two" }])
      })

      it("should construct the correct SQL query", async () => {
        const dbStub = sandbox.stub(DB, "query").resolves({ rows: [] })
        await request(app).get("/industries")

        expect(dbStub.firstCall.args[0]).to.equal("SELECT industry_id, description FROM industries")
      })

      it("should 500 if query fails", async () => {
        sandbox.stub(DB, "query").rejects()
        await request(app).get("/industries").expect(500)
      })
    })
  })
})
