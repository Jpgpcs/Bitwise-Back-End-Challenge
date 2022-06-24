const connectDb = require("./db/connect")
const port = process.env.PORT || 3000
const app = require("./app")

const start = async () =>{
    try{
        await connectDb(process.env.MONGO_URI)
        app.listen(port, ()=>{
            console.log("Server ON")
        })
    }catch(err){
        console.log(err)
    }
}
start()