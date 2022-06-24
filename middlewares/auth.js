const jwt = require("jsonwebtoken")
const {UnauthenticatedError} = require("../errors")

const auth = async (req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        throw new UnauthenticatedError("Authentication Invalid")
    }
    const token = authHeader.split(" ")[1]   
    jwt.verify(token, process.env.JWT_SECRET, (err)=>{
        if(err){
            throw new UnauthenticatedError("Authentication Invalid")
        }
    })
    next()
}

module.exports = auth