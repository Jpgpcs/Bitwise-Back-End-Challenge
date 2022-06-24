const {register, registerWithGithub, login} = require("../controllers/authControllers")
const express = require("express")
const router = express.Router()

router.post("/register", register)
router.post("/register_with_github", registerWithGithub)
router.post("/login", login)

module.exports = router