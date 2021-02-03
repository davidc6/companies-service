import { expect } from "chai"
import { spawn, ChildProcessWithoutNullStreams } from "child_process"
import fetch from "node-fetch"
import {} from "dotenv/config"

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

describe("Routes integration", () => {
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
