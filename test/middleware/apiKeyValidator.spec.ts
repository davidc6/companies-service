import { Request, Response } from "express"

import chai, { expect } from "chai"
import sinon from "sinon"
import sinonChai from "sinon-chai"
chai.use(sinonChai)

import { apiKeyValidator } from "../../src/middleware/apiKeyValidator"
import { CustomError } from "../../src/utils/customError"

const sandbox = sinon.createSandbox()

describe("api key validator middleware", () => {
  it("calls next with error response if api key is invalid", () => {
    const reqMock = {
      originalUrl: "some-url",
      header: (a) => "123",
    } as Request
    const res = {} as Response
    const nextStub = sandbox.stub()
    process.env.API_KEYS = "456"

    apiKeyValidator(reqMock, res, nextStub)

    expect(nextStub).to.be.calledOnce
    expect(nextStub.args[0][0]).to.be.instanceOf(CustomError)
    expect(nextStub.args[0][0].status).to.eq(401)
    expect(nextStub.args[0][0].title).to.eq("Unauthorized request")
    expect(nextStub.args[0][0].detail).to.eq(
      "Please supply a valid API key or sign up to get one issued to you."
    )
  })

  it("calls next without error response if api key is valid", () => {
    const reqMock = {
      originalUrl: "some-url",
      header: (a) => "123",
    } as Request
    const res = {} as Response
    const nextStub = sandbox.stub()
    process.env.API_KEYS = "123"

    apiKeyValidator(reqMock, res, nextStub)

    expect(nextStub).to.be.calledOnce
    expect(nextStub.args[0].length).to.equal(0)
  })

  it("calls next without validation if path is /", () => {
    const reqMock = {
      path: "/",
      header: (a) => "123",
    } as Request
    const res = {} as Response
    const nextStub = sandbox.stub()
    process.env.API_KEYS = "456"

    apiKeyValidator(reqMock, res, nextStub)

    expect(nextStub).to.be.calledOnce
    expect(nextStub.args[0].length).to.equal(0)
  })
})
