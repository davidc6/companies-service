import http from "http"
import app from "../index"

const LOCAL_PORT = 8080

const init = () => {
  const normalizePort = (port) => {
    const parsedPort = parseInt(port, 10)

    if (isNaN(parsedPort)) {
      return port
    }

    if (parsedPort >= 0) {
      return parsedPort
    }

    return false
  }

  const PORT = normalizePort(process.env.PORT || LOCAL_PORT)
  const HOST = process.env.HOST || "127.0.0.1"

  const onError = (e) => {
    if (e.syscall !== "listen") {
      throw e
    }

    const bind = typeof PORT === "string" ? "Pipe " + PORT : "Port " + PORT

    switch (e.code) {
      case "EACCES":
        console.error(bind + " requires elevated privileges")
        process.exit(1)
        break
      case "EADDRINUSE":
        console.error(bind + " is already in use")
        process.exit(1)
        break
      default:
        throw e
    }
  }

  const onListening = () => {
    const addr = server.address()
    const address = typeof addr === "string" ? "" : addr.address
    const port = typeof addr === "string" ? "" : addr.port

    // const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port
    const at = `${address}:${port}`

    console.log("Server running at http://" + at)
  }

  const server = http.createServer(app)
  server.listen(PORT, HOST)
  server.on("listening", onListening)
  server.on("error", onError)
}

init()
