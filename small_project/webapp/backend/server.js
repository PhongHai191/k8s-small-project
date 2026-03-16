const express = require("express")
const session = require("express-session")
const RedisStore = require("connect-redis").default
const {createClient} = require("redis")
const cors = require("cors")

const {connectWithRetry} = require("./db")

const auth = require("./routes/auth")
const products = require("./routes/products")
const reviews = require("./routes/reviews")

const app = express()

app.use(express.json())

app.use(cors({
 origin:true,
 credentials:true
}))

const redisClient = createClient({
 url:"redis://redis:6379"
})

redisClient.connect()

app.use(session({

 store:new RedisStore({client:redisClient}),
 secret:"secret",
 resave:false,
 saveUninitialized:false

}))


app.use("/auth",auth)
app.use("/products",products)
app.use("/reviews",reviews)


async function start(){

 await connectWithRetry()

 app.listen(5000,()=>{

  console.log("Backend running")

 })

}

start()