import request from "supertest"
import { expect } from "chai"
import sinon from "sinon"
import * as domain from "../../src/utils/domain"
import * as db from "../../src/db"
import app from "../../src/index"
import { QueryResult } from "pg"

const mockDbData = [
  { id: "1", name: "One", summary: "summary one", careers: "link-one" },
  { id: "2", name: "Two", summary: "summary two", careers: "link-two" },
  { id: "3", name: "Three", summary: "summary three", careers: "link-three" },
]

const resolvedData = { rows: mockDbData } as QueryResult

const sandbox = sinon.createSandbox()

describe("routes", () => {
  afterEach(() => {
    sandbox.restore()
  })

  describe("Integration tests", () => {
    describe("GET /", () => {
      let res = null

      beforeEach(async () => {
        sandbox.stub(domain, "getEnvBasedDomain").returns("fake-domain")
        res = await request(app).get("/")
      })

      it("should respond with 200, valid headers and body", async () => {
        expect(res.status).to.equal(200)
      })

      it("should set application/json content-type header", async () => {
        expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
      })

      it("should set valid body", async () => {
        const expected = {
          all_companies_url: "fake-domain/companies",
          company_url: "fake-domain/companies/{company_id}",
          current_url: "fake-domain",
        }

        expect(res.body).to.deep.equal(expected)
      })
    })

    describe("GET /companies", () => {
      describe("when a database query succeeds", () => {
        let res = null

        beforeEach(async () => {
          sandbox.stub(db, "query").resolves(resolvedData)
          res = await request(app).get("/companies")
        })

        it("should respond with 200", async () => {
          expect(res.status).to.equal(200)
        })

        it("should set content-type header to application/json", async () => {
          expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
        })

        it("should set valid body", async () => {
          expect(res.body).to.deep.equal(mockDbData)
        })
      })

      describe("when a database query fails", () => {
        let res = null

        beforeEach(async () => {
          sandbox.stub(db, "query").rejects()
          res = await request(app).get("/companies")
        })

        it("should respond with 500", async () => {
          expect(res.status).to.equal(500)
        })

        it("should set application/json content-type header", async () => {
          expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
        })

        it("should set valid body", async () => {
          const expected = {
            title: "Oops! Looks like something is missing.",
            status: 500,
            instance: "/companies",
            detail: "An error has occurred and we are working to fix the problem.",
          }

          expect(res.body).to.deep.equal(expected)
        })
      })
    })

    describe("GET /companies/:id", () => {
      describe("when a database query succeeds", () => {
        let res = null

        beforeEach(async () => {
          sandbox.stub(domain, "getEnvBasedDomain").returns("fake-domain")
          sandbox.stub(db, "query").resolves(resolvedData)
          res = await request(app).get("/companies/some-company-id")
        })

        it("should respond with 200", async () => {
          expect(res.status).to.equal(200)
        })

        it("should set content-type header to application/json", async () => {
          expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
        })

        it("should set valid body", async () => {
          expect(res.body).to.deep.equal(mockDbData[0])
        })

        it("should respond with 200 if the company_id is alphanumeric", async () => {
          res = await request(app).get("/companies/some-company-1")
          expect(res.status).to.equal(200)
        })
      })

      describe("when a database query fails", () => {
        let res = null

        beforeEach(async () => {
          sandbox.stub(db, "query").rejects()
          res = await request(app).get("/companies/some-company-id")
        })

        it("should respond with 500", async () => {
          expect(res.status).to.equal(500)
        })

        it("should set content-type header to application/json", async () => {
          expect(res.headers["content-type"]).to.equal("application/json; charset=utf-8")
        })

        it("should set valid body", async () => {
          const expected = {
            detail: "An error has occurred and we are working to fix the problem.",
            instance: "/companies/some-company-id",
            status: 500,
            title: "Internal Server Error",
          }

          expect(res.body).to.deep.equal(expected)
        })

        it("should respond with 500 if url format is incorrect", async () => {
          res = await request(app).get("/companies/some-&company-id")

          const expected = {
            title: "Bad Request",
            status: 400,
            instance: "/companies/some-&company-id",
            detail: "Sorry, looks like this url is invalid.",
          }

          expect(res.status).to.equal(400)
          expect(res.body).to.deep.equal(expected)
        })
      })
    })
  })
})
