require("dotenv").config()
require("express-async-errors")

const express = require("express")
const app = express()

const authRouter = require("./routes/auth")
const usersRouter = require("./routes/users")

const errorHanderMiddleware = require("./middlewares/errorHandler")
const notFoundMiddleware = require("./middlewares/errorHandler")
const authMiddleware = require("./middlewares/auth")

const helmet = require("helmet")
const cors = require("cors")
const xss = require("xss-clean")
const rateLimiter = require("express-rate-limit")

app.set('trust proxy', 1)
app.use(rateLimiter({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
}))
app.use(express.json())
app.use(helmet())
app.use(cors())

app.get("/", (req, res)=>{
	res.send("ON")
})

app.use("/api/v1/authentication", authRouter)
app.use("/api/v1/users", authMiddleware, usersRouter)

app.use(errorHanderMiddleware)
app.use(notFoundMiddleware)

module.exports = app