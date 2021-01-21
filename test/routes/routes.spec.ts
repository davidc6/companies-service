import request from "supertest"
import { expect } from "chai"
import sinon from "sinon"
import * as domain from "../../src/utils/domain"
import * as db from "../../src/db"
import app from "../../src/index"

const mockDbData = [
  { id: "1", name: "One", summary: "summary one", careers: "link-one" },
  { id: "2", name: "Two", summary: "summary two", careers: "link-two" },
  { id: "3", name: "Three", summary: "summary three", careers: "link-three" },
]

const resolvedData = { rows: mockDbData }

const sandbox = sinon.createSandbox()

describe("routes", () => {
  afterEach(() => {
    sandbox.restore()
  })

  describe("GET /", () => {
    it("should respond with 200, valid headers and body", async () => {
      const expected = {
        all_companies_url: `fake-domain/companies`,
      }

      sandbox.stub(domain, "getEnvBasedDomain").returns("fake-domain")

      const res = await request(app).get("/")

      expect(res.status).to.equal(200)
      expect(res.headers["status"]).to.equal("200 OK")
      expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
      expect(res.body).to.deep.equal(expected)
    })
  })

  describe("GET /companies", () => {
    it("should respond with 200, valid headers and body", async () => {
      sandbox.stub(db, "query").resolves(resolvedData)

      const res = await request(app).get("/companies")

      expect(res.status).to.equal(200)
      expect(res.headers["status"]).to.equal("200 OK")
      expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
      expect(res.body).to.deep.equal(mockDbData)
    })

    it("should respond with 500 and valid response body", async () => {
      sandbox.stub(db, "query").rejects()

      const res = await request(app).get("/companies")

      expect(res.status).to.equal(500)
      expect(res.headers["status"]).to.equal("500 Internal Server Error")
      expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
      expect(res.body).to.deep.equal({ message: "Sorry, something went wrong." })
    })
  })

  describe("GET /companies/:id", () => {
    it("should respond with 200, valid headers and body", async () => {
      sandbox.stub(domain, "getEnvBasedDomain").returns("fake-domain")
      sandbox.stub(db, "query").resolves(resolvedData)

      const res = await request(app).get("/companies/some-company-id")

      expect(res.status).to.equal(200)
      expect(res.headers["status"]).to.equal("200 OK")
      expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
      expect(res.body).to.deep.equal(mockDbData[0])
    })

    it("should respond with 500, valid headers and body", async () => {
      sandbox.stub(db, "query").rejects()

      const res = await request(app).get("/companies/some-company-id")

      expect(res.status).to.equal(500)
      expect(res.headers["status"]).to.equal("500 Internal Server Error")
      expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
      expect(res.body).to.deep.equal({ message: "Sorry, something went wrong." })
    })

    it("should respond with 500 if url format is incorrect", async () => {
      sandbox.stub(db, "query").rejects()

      const res = await request(app).get("/companies/some-&company-id")

      expect(res.status).to.equal(500)
      expect(res.headers["status"]).to.equal("500 Internal Server Error")
      expect(res.body).to.deep.equal({ message: "Sorry, something went wrong." })
    })
  })
})
