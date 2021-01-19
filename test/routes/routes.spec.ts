import request from "supertest"
import { expect } from "chai"
import sinon from "sinon"
import * as domain from "../../src/utils/domain"
import app from "../../src/index"
import { tempCompaniesResponse, tempCompanyData } from "../../src/routes"

const sandbox = sinon.createSandbox()

describe("routes", () => {
  afterEach(() => {
    sandbox.restore()
  })

  describe("GET /", () => {
    it("should respond with 200 and valid headers", async () => {
      const res = await request(app).get("/")

      expect(res.status).to.equal(200)
      expect(res.headers["status"]).to.equal("200 OK")
      expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
    })

    it("should respond with valid payload", async () => {
      sandbox.stub(domain, "getEnvBasedDomain").returns("fake-domain")

      const res = await request(app).get("/")

      const expected = {
        all_companies_url: `fake-domain/companies`,
      }

      expect(res.body).to.deep.equal(expected)
    })
  })

  describe("GET /companies", () => {
    it("should respond with 200 and valid headers", async () => {
      const res = await request(app).get("/companies")

      expect(res.status).to.equal(200)
      expect(res.headers["status"]).to.equal("200 OK")
      expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
    })

    it("should respond with valid payload", async () => {
      sandbox.stub(domain, "getEnvBasedDomain").returns("fake-domain")

      const res = await request(app).get("/companies")

      expect(res.body).to.deep.equal(tempCompaniesResponse)
    })
  })

  describe("GET /companies/{companyId}", () => {
    it("should respond with 200 and valid headers", async () => {
      const res = await request(app).get("/companies/some-company-id")

      expect(res.status).to.equal(200)
      expect(res.headers["status"]).to.equal("200 OK")
      expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
    })

    it("should respond with valid payload", async () => {
      sandbox.stub(domain, "getEnvBasedDomain").returns("fake-domain")

      const res = await request(app).get("/companies/some-company-id")

      expect(res.body).to.deep.equal(tempCompanyData)
    })
  })
})