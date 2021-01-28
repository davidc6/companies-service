import { expect } from "chai"
import sinon from "sinon"
import * as domain from "../../src/utils/domain"

const sandbox = sinon.createSandbox()

describe("domain utility", () => {
  afterEach(() => {
    sandbox.restore()
  })

  it("should return a domain based on config values", () => {
    expect(
      domain.getEnvBasedDomain({
        protocol: "http",
        get: () => "fake-domain:8080",
      })
    ).to.equal("http://fake-domain:8080")
  })
})
