const request  = require("supertest")
const app = require("../app")
const mongoose = require("mongoose")
const {MongoMemoryServer} = require("mongodb-memory-server")

let mongoMemoryServer

beforeAll(async ()=>{
    mongoMemoryServer = await MongoMemoryServer.create()
    const uri = mongoMemoryServer.getUri()
    await mongoose.connect(uri)
})

beforeEach(async ()=>{
    await mongoose.connection.collection("users").deleteMany()
})

afterAll(async ()=>{
    await mongoose.connection.close()
    await mongoMemoryServer.stop()
})

describe("users routes", ()=>{
    describe("testing /:username route", ()=>{
        describe("getUser controller", ()=>{
            describe("valid cases", ()=>{
                describe("user hasn't GitHub account", ()=>{
                    test("should response with the user object and 200 status code", async ()=>{
                        const testUser = {
                            username: "username",
                            password: "password",
                            name: "name",
                            lastName: "lastName",
                            profileImageUrl: "https://profile.ImageUrl.com/u/2?v=4",
                            bio: "bio",
                            email: "email@test.com",
                            gender: "Male"
                        }
                        const registerResponse = await request(app).post("/api/v1/authentication/register").send(testUser)
                        const {token} = registerResponse.body
                        const response = await request(app).get("/api/v1/users/username").auth(token, { type: 'bearer' })
                        const {user} = response.body
                        expect(response.status).toBe(200)
                        expect(user._id).toBeTruthy()
                    })
                })
                describe("user has GitHub account", ()=>{
                    test("should response with the user object, some more fields mapped by the GitHub api and 200 status code", async ()=>{
                        const testUser = {
                            username: "defunkt",
                            password: "password",
                            email: "email@test.com",
                        }
                        const registerResponse = await request(app).post("/api/v1/authentication/register_with_github").send(testUser)
                        const {token} = registerResponse.body
                        const response = await request(app).get("/api/v1/users/defunkt").auth(token, { type: 'bearer' })
                        const {user, followers, following, publicRepos, url} = response.body
                        expect(response.status).toBe(200)
                        expect(user._id).toBeTruthy()
                        expect(followers).toBeTruthy()
                        expect(following).toBeTruthy()
                        expect(publicRepos).toBeTruthy()
                        expect(url).toBeTruthy()
                    })
                })
            })
            describe("invalid case", ()=>{
                test("not found username, should not get", async ()=>{
                    const testUser = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com"
                    }
                    const registerResponse = await request(app).post("/api/v1/authentication/register").send(testUser)
                    const {token} = registerResponse.body
                    const response = await request(app).get("/api/v1/users/wrongusername").auth(token, { type: 'bearer' })
                    expect(response.status).toBe(404)
                    expect(response.body.msg).toBe("No user with username: wrongusername")
                })
            })
        })
        describe("updateUser controller", ()=>{
            describe("valid case", ()=>{
                test("should response with the user object and 200 status code", async ()=>{
                    const testUser = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com"
                    }
                    const toUpdate = {
                        lastName: "lastName"
                    }
                    const registerResponse = await request(app).post("/api/v1/authentication/register").send(testUser)
                    const {token} = registerResponse.body
                    const response = await request(app).patch("/api/v1/users/username").auth(token, { type: 'bearer' })
                    .send(toUpdate)
                    const {user} = response.body
                    expect(response.status).toBe(200)
                    expect(user._id).toBeTruthy()
                })                
            })
            describe("invalid cases", ()=>{
                test("not found username, should not patch", async ()=>{
                    const testUser = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com"
                    }
                    const registerResponse = await request(app).post("/api/v1/authentication/register").send(testUser)
                    const {token} = registerResponse.body
                    const response = await request(app).patch("/api/v1/users/wrongusername").auth(token, { type: 'bearer' })
                    expect(response.status).toBe(404)
                    expect(response.body.msg).toBe("No user with username: wrongusername")
                })
                test("no fields, should not patch", async ()=>{
                    const testUser = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com"
                    }
                    const toUpdate = {}
                    const registerResponse = await request(app).post("/api/v1/authentication/register").send(testUser)
                    const {token} = registerResponse.body
                    const response = await request(app).patch("/api/v1/users/username").auth(token, { type: 'bearer' })
                    .send(toUpdate)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide fields to update")
                })
                test("required, should not patch", async ()=>{
                    const testUser = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com"
                    }
                    const toUpdate = {
                        username: ""
                    }
                    const registerResponse = await request(app).post("/api/v1/authentication/register").send(testUser)
                    const {token} = registerResponse.body
                    const response = await request(app).patch("/api/v1/users/username").auth(token, { type: 'bearer' })
                    .send(toUpdate)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide username")
                })
            })
        })
        describe("delteUser controller", ()=>{
            describe("valid case", ()=>{
                test("should response with the user object and 200 status code", async ()=>{
                    const testUser = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com"
                    }
                    const registerResponse = await request(app).post("/api/v1/authentication/register").send(testUser)
                    const {token} = registerResponse.body
                    const response = await request(app).delete("/api/v1/users/username").auth(token, { type: 'bearer' })
                    const {user} = response.body
                    expect(response.status).toBe(200)
                    expect(user._id).toBeTruthy()
                })                
            })
            describe("invalid case", ()=>{
                test("not found username, should not patch", async ()=>{
                    const testUser = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com"
                    }
                    const registerResponse = await request(app).post("/api/v1/authentication/register").send(testUser)
                    const {token} = registerResponse.body
                    const response = await request(app).delete("/api/v1/users/wrongusername").auth(token, { type: 'bearer' })
                    expect(response.status).toBe(404)
                    expect(response.body.msg).toBe("No user with username: wrongusername")
                })
            })
        })
    })
})