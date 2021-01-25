import http from "http"
import app from "../index"
import config from "config"

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

  const PORT = normalizePort(process.env.PORT || config.get("port"))

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
    const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port
    console.log("Listening on " + bind)
  }

  const server = http.createServer(app)
  server.listen(PORT)
  server.on("listening", onListening)
  server.on("error", onError)
}

init()
