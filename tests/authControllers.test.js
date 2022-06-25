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

describe("auth routes", ()=>{
    describe("testing /register route", ()=>{
        describe("valid case", ()=>{
            test("should create user in database and response with the user object, token and 201 status code", async ()=>{
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
                const response = await request(app).post("/api/v1/authentication/register").send(testUser)
                const {user, token} = response.body
                expect(response.status).toBe(201)
                expect(user._id).toBeTruthy()
                expect(token).toBeTruthy()
            })
        })
        describe("invalid cases", ()=>{
            describe("username field cases", ()=>{
                test("required, should not register", async ()=>{
                    const user = {
                        username: "",
                        password: "password",
                        name: "name",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide username")
                })
                test("minlength, should not register", async ()=>{
                    const user = {
                        username: "user",
                        password: "password",
                        name: "name",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Path `username` (`user`) is shorter than the minimum allowed length (5).")
                })
                test("maxlength, should not register", async ()=>{
                    const user = {
                        username: "usernameusernameusernameusername",
                        password: "password",
                        name: "name",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Path `username` (`usernameusernameusernameusername`) is longer than the maximum allowed length (30).")
                })
                test("unique, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com",
                    }
                    await request(app).post("/api/v1/authentication/register").send(user)
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Duplicate value entered for username field, please choose another value")
                })
            })
            describe("password field cases", ()=>{
                test("required, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "",
                        name: "name",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide password")
                })
                test("minlength, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "passw",
                        name: "name",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Path `password` (`passw`) is shorter than the minimum allowed length (6).")
                })
            })
            describe("name field cases", ()=>{
                test("required, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide name")
                })
                test("minlength, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "na",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Path `name` (`na`) is shorter than the minimum allowed length (3).")
                })
                test("maxlength, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "namenamenamenamenamenamenamename",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg)
                    .toBe("Path `name` (`namenamenamenamenamenamenamename`) is longer than the maximum allowed length (30).")
                })
                test("match, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name1",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide a valid name")
                })
            })
            describe("lastName field cases", ()=>{
                test("minlength, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        lastName: "la",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Path `lastName` (`la`) is shorter than the minimum allowed length (3).")
                })
                test("maxlength, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        lastName: "lastNamelastNamelastNamelastName",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg)
                    .toBe("Path `lastName` (`lastNamelastNamelastNamelastName`) is longer than the maximum allowed length (30).")
                })
                test("match, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        lastName: "lastName1",
                        email: "email@test.com",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide a valid last name")
                })
            })
            describe("profileImageUrl field case", ()=>{
                test("match, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@teste.com",
                        profileImageUrl: "profileImageUrl"
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide a valid url")
                })
            })
            describe("bio field cases", ()=>{
                test("minlength, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com",
                        bio: "bi"
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Path `bio` (`bi`) is shorter than the minimum allowed length (3).")
                })
                test("maxlength, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com",
                        bio: "biobiobiobiobiobiobiobiobiobiobiobio"
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg)
                    .toBe("Path `bio` (`biobiobiobiobiobiobiobiobiobiobiobio`) is longer than the maximum allowed length (30).")
                })
                test("match, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@test.com",
                        bio: "bio1"
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide a valid bio")
                })
            })
            describe("email field cases", ()=>{
                test("required, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide email")
                })
                test("match, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email",
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide a valid email")
                })
            })
            describe("gender field cases", ()=>{
                test("enum, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        name: "name",
                        email: "email@teste.com",
                        gender: "gender"
                    }
                    const response = await request(app).post("/api/v1/authentication/register").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please enter one of these values: Male, Female and Not specified")
                })
            })
        })
    })
    describe("testing /register_with_github route", ()=>{
        describe("valid cases", ()=>{
            test("should create user in database and response with the user object, token and 201 status code", async ()=>{
                const testUser = {
                    username: "defunkt",
                    password: "password",
                    email: "email@test.com",
                }
                const response = await request(app).post("/api/v1/authentication/register_with_github").send(testUser)
                const {user, token} = response.body
                expect(response.status).toBe(201)
                expect(user._id).toBeTruthy()
                expect(token).toBeTruthy()
            })
            test("should split the name field into name and last name", async ()=>{
                const testUser = {
                    username: "defunkt",
                    password: "password",
                    email: "email@test.com",
                }
                const response = await request(app).post("/api/v1/authentication/register_with_github").send(testUser)
                const {user} = response.body
                expect(user.name).toBe("Chris")
                expect(user.lastName).toBe("Wanstrath")
            })
        })
        describe("invalid case", ()=>{
            describe("username field", ()=>{
                test("not found, should not register", async ()=>{
                    const user = {
                        username: "username",
                        password: "password",
                        email: "email@test.com"
                    }
                    const response = await request(app).post("/api/v1/authentication/register_with_github").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("GitHub account not found with this user name, please try a different one.")
                })
            })
        })
    })
    describe("testing /login route", ()=>{
        describe("valid case", ()=>{
            test("should log the user and response with a token and 200 status code", async ()=>{
                const user = {
                    username: "defunkt",
                    password: "password",
                    email: "email@test.com",
                }
                await request(app).post("/api/v1/authentication/register_with_github").send(user)
                const response = await request(app).post("/api/v1/authentication/login").send(user)
                const {token} = response.body
                expect(response.status).toBe(200)
                expect(token).toBeTruthy()
            })
        })
        describe("invalid cases", ()=>{
            describe("username and password field", ()=>{
                test("required, should not log", async ()=>{
                    const user = {
                        username: "",
                        password: "password"
                    }
                    const response = await request(app).post("/api/v1/authentication/login").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide username and password")
                })
                test("required, should not log", async ()=>{
                    const user = {
                        username: "username",
                        password: ""
                    }
                    const response = await request(app).post("/api/v1/authentication/login").send(user)
                    expect(response.status).toBe(400)
                    expect(response.body.msg).toBe("Please provide username and password")
                })
                test("invalid username, should not log", async ()=>{
                    const user = {
                        username: "username",
                        password: "password"
                    }
                    const response = await request(app).post("/api/v1/authentication/login").send(user)
                    expect(response.status).toBe(401)
                    expect(response.body.msg).toBe("Invalid credentials")
                })
                test("invalid password, should not log", async ()=>{
                    const registerUser = {
                        username: "defunkt",
                        password: "password",
                        email: "email@test.com",
                    }
                    const user = {
                        username: "defunkt",
                        password: "wrongpassword"
                    }
                    await request(app).post("/api/v1/authentication/register_with_github").send(registerUser)
                    const response = await request(app).post("/api/v1/authentication/login").send(user)
                    expect(response.status).toBe(401)
                    expect(response.body.msg).toBe("Invalid credentials")
                })
            })
        })
    })
})