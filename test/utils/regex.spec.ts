import { expect } from "chai"
import { isAlphaNumeric } from "../../src/utils/regex"

describe("regex utility", () => {
  describe("isAlphaNumeric()", () => {
    describe("should return true", () => {
      it("if the value is alphabetic", () => {
        expect(isAlphaNumeric("some")).to.be.true
      })

      it("if the value is alphanumeric", () => {
        expect(isAlphaNumeric("some-1")).to.be.true
      })

      it("if the value is numeric", () => {
        expect(isAlphaNumeric(1234)).to.be.true
      })
    })

    describe("should return false", () => {
      it("if the value is not alphanumeric and a single character", () => {
        expect(isAlphaNumeric("?")).to.be.false
      })

      it("if the value contains non-alphanumeric character", () => {
        expect(isAlphaNumeric("a9?")).to.be.false
      })
    })
  })
})
