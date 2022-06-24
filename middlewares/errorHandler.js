const {StatusCodes} = require("http-status-codes")

const errorHandler = async (err, req, res, next)=>{
    //Handling with specific errors
    let customError = {
        msg: err.message || "Something went wrong please try again later",
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    }
    if(err.code && err.code === 11000){
        customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    if(err.name === "ValidationError"){
        customError.msg = Object.values(err.errors).map((item=>item.message)).join(", ")
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    if(err.response && err.response.headers.server === 'GitHub.com' && err.response.statusText === 'Not Found'){
        customError.msg = "GitHub account not found with this user name, please try a different one."
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    if(err.errors && err.errors.gender){
        customError.msg = "Please enter one of these values: Male, Female and Not specified"
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    if(err.errors && err.errors.profileImageUrl && err.errors.profileImageUrl.kind === "minlength"){
        customError.msg = "Please provide a valid url"
        customError.statusCode = StatusCodes.BAD_REQUEST
    }
    return res.status(customError.statusCode).json({msg: customError.msg})
}

module.exports = errorHandler