const axios = require("axios")
const User = require("../models/User")
const {StatusCodes} = require("http-status-codes")
const {BadRequestError} = require("../errors")
const {UnauthenticatedError} = require("../errors")

const register = async (req, res)=>{
        const user = await User.create({...req.body})
        const token = user.createJwt()
        res.status(StatusCodes.CREATED).json({user, token})
    }

const registerWithGithub = async (req, res)=>{
    /*
        Email have to be unique, but GitHub api can send a null email,
        to handle it the user have to send it in the request, if the
        GitHub api does not send it
    */
    const {username, password, email: emailWithoutGitHub} = req.body
    const githubUser = await axios.get(`${process.env.URL}/${username}`)
    const {
        avatar_url: profileImageUrl,
        name,
        email: emailWithGitHub,
    } = githubUser.data
    /*
        GitHub api does not have last name field, to handle it,
        i have to split the name wich the api sends
    */
    const splitedName = name.split(" ")
    let firstName, lastName
    if(splitedName.length > 1){
        firstName = [...splitedName].shift()
        lastName = splitedName.slice(1).join(" ")
    }else{
        firstName = splitedName[0]
        lastName = null
    }
    if (!emailWithGitHub && !emailWithoutGitHub){
        throw new BadRequestError("Please provide email")
    }
    const user = await User.create({
        username: username,
        password: password,
        name: firstName,
        lastName: lastName,
        profileImageUrl: profileImageUrl,
        email: emailWithGitHub ?? emailWithoutGitHub,
    })
    const token = user.createJwt()
    res.status(StatusCodes.CREATED).json({user, token})
}

const login = async (req, res)=>{
    const {username, password} = req.body
    if(!username || !password){
        throw new BadRequestError("Please provide username and password")
    }
    const user = await User.findOne({username})
    if(!user){
        throw new UnauthenticatedError("Invalid credentials")
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if(!isPasswordCorrect){
        throw new UnauthenticatedError("Invalid credentials")
    }
    const token = user.createJwt()
    res.status(StatusCodes.OK).json({token})
}

module.exports = {
    register,
    login,
    registerWithGithub,
}