const axios = require("axios")
const User = require("../models/User")
const {StatusCodes} = require("http-status-codes")
const {NotFoundError} = require("../errors")
const {BadRequestError} = require("../errors")

const getUser = async (req, res)=>{
    const {username} = req.params
    const user = await User.findOne({username})
    if(!user){
        throw new NotFoundError(`No user with username: ${username}`)
    }
    //Handling the case whether the user has a GitHub account or not
    try{
        const githubUser = await axios.get(`${process.env.URL}/${username}`)
        const {
            followers, 
            following, 
            public_repos: publicRepos,
            url, 
        } = githubUser.data
        res.status(StatusCodes.OK).json({
            user,
            followers,
            following,
            publicRepos,
            url,
        })
    }catch(err){
        res.status(StatusCodes.OK).json({user})
    }
}

const updateUser = async (req, res)=>{
    const {username} = req.params
    let user = await User.findOne({username})
    if(!user){
        throw new NotFoundError(`No user with username: ${username}`)
    }
    const userObject = {
        username: newUsername,
        name: firstName,
        lastName,
        avatar_url,
        bio,
        email,
        gender,
    } = req.body
    if((Object.keys(userObject).length) < 1){
        throw new BadRequestError("Please provide fields to update")
    }
    user = await User.findOneAndUpdate({username}, req.body, {
        new: true,
        runValidators: true
    })
    res.status(StatusCodes.OK).json({user})
}

const deleteUser = async (req, res)=>{
    const {username} = req.params
    const user = await User.findOneAndDelete({username})
    if(!user){
        throw new NotFoundError(`No user with username: ${username}`)
    }
    res.status(StatusCodes.OK).json({user})
}

module.exports = {
    getUser,
    updateUser,
    deleteUser,
}