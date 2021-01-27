import chai, { expect } from "chai"
import request from "supertest"
import sinon from "sinon"
import sinonChai from "sinon-chai"
chai.use(sinonChai)
import app from "../../src/index"
import { errorHandler } from "../../src/middleware/errorHandler"
import { ResponseError } from "../../src/utils/error"
import { Request, Response } from "express"

const sandbox = sinon.createSandbox()

describe("error handler middleware", () => {
  describe("integration tests", () => {
    it("should return 404 for an invalid route", async () => {
      const res = await request(app).get("/non-existent-route")

      expect(res.statusCode).to.equal(404)
    })

    it("should return valid body for an invalid route", async () => {
      const res = await request(app).get("/non-existent-route")

      const expected = {
        detail: "Sorry, looks like this url is invalid.",
        title: "Not Found",
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
    const e = new Error("error")

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

    it("should set alternative title if title is not set on the err object", async () => {
      const errStub = ResponseError("", 400, "/some-url", "This error happened just because", e)

      errorHandler(errStub, reqStub, resInstance as Response, nextSpy)

      const expected = {
        title: "Not Found",
        status: 400,
        instance: "/some-url",
        detail: "This error happened just because",
      }

      expect(jsonSpy).to.have.been.calledOnceWith(expected)
    })

    it("should set instance (requests original url) if instance is not set on the err object", async () => {
      const errStub = ResponseError("Some title", 400, "", "This error happened just because", e)

      errorHandler(errStub, reqStub, resInstance as Response, nextSpy)

      const expected = {
        title: "Some title",
        status: 400,
        instance: "/some-url",
        detail: "This error happened just because",
      }

      expect(jsonSpy).to.have.been.calledOnceWith(expected)
    })

    it("should set generic detail if detail is not set on the err object", async () => {
      const errStub = ResponseError("Some title", 400, "/some-instance", "", e)

      errorHandler(errStub, reqStub, resInstance as Response, nextSpy)

      const expected = {
        title: "Some title",
        status: 400,
        instance: "/some-instance",
        detail: "Sorry, looks like this url is invalid.",
      }

      expect(jsonSpy).to.have.been.calledOnceWith(expected)
    })

    it("should set status to 500 if status is not set on the error object", async () => {
      const errStub = ResponseError("Some title", null, "/some-instance", "", e)

      errorHandler(errStub, reqStub, resInstance as Response, nextSpy)

      const expected = {
        title: "Some title",
        status: 500,
        instance: "/some-instance",
        detail: "Sorry, looks like this url is invalid.",
      }

      expect(jsonSpy).to.have.been.calledOnceWith(expected)
    })
  })
})
