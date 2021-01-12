import express from 'express'

const app = express()

app.get('/', (req, res) => {
  res.send("We got signal!")
})

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
