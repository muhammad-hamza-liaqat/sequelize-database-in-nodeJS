const express = require("express");
const app = express();
const connection = require("./database/connection")
const ordersR = require("./routes/orderRoute")


// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use('/orders',ordersR)


app.listen(3000, ()=>{
    console.log("server running")
})
