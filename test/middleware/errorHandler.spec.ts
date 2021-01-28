import chai, { expect } from "chai"
import request from "supertest"
import sinon from "sinon"
import sinonChai from "sinon-chai"
chai.use(sinonChai)
import app from "../../src/index"
import { errorHandler } from "../../src/middleware/errorHandler"
import { CustomError } from "../../src/utils/customError"
import { Request, Response } from "express"

const sandbox = sinon.createSandbox()

describe("error handler middleware", () => {
  describe("integration tests", () => {
    it("should return 404 for an invalid route", async () => {
      const res = await request(app).get("/non-existent-route")

      expect(res.status).to.equal(404)
    })

    it("should return valid body for an invalid route", async () => {
      const res = await request(app).get("/non-existent-route")

      const expected = {
        detail: "not found",
        title: "not found",
        status: 404,
        instance: "/non-existent-route",
      }

      expect(res.body).to.deep.equal(expected)
    })
  })

  describe("unit tests", () => {
    // request
    const reqStub = {
      originalUrl: "/some-url",
    } as Request

    // response instance
    let resInstance = null

    // spies
    let setSpy = null
    let statusSpy = null
    let jsonSpy = null
    let nextSpy = null

    beforeEach(() => {
      setSpy = sandbox.spy()
      statusSpy = sandbox.spy()
      jsonSpy = sandbox.spy()
      nextSpy = sandbox.spy()

      // response class
      class resStub {
        set(a, b) {
          setSpy(a, b)
          return
        }

        status(a) {
          statusSpy(a)
          return this
        }

        json(a) {
          jsonSpy(a)
          return
        }
      }
      resInstance = new resStub()
    })

    afterEach(() => {
      sandbox.reset()
    })

    it("should set title and detail from Error message, set status to 500 if these are not set on CustomError", async () => {
      const errStub = new CustomError(new Error("Error title"))

      errorHandler(errStub, reqStub, resInstance as Response, nextSpy)

      const expected = {
        title: "Error title",
        status: 500,
        instance: "/some-url",
        detail: "Error title",
      }

      expect(jsonSpy).to.have.been.calledOnceWith(expected)
    })

    it("should create response based on data from CustomError", async () => {
      const errStub = new CustomError(new Error("Error title"))
      errStub.status = 400
      errStub.title = "Some title"
      errStub.detail = "Some detail"

      errorHandler(errStub, reqStub, resInstance as Response, nextSpy)

      const expected = {
        title: "Some title",
        status: 400,
        instance: "/some-url",
        detail: "Some detail",
      }

      expect(jsonSpy).to.have.been.calledOnceWith(expected)
    })
  })
})
