const express = require('express');
require('dotenv').config();
const {connection}= require('./config/db')
const {userRouter} = require('./router/userRouter')
const {authenticate} = require('./middleware/authentication');
const cors = require('cors');
const app = express();


app.use(cors({
    origin:"*"
}))
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('welcome to EquiSoft')
});


app.use('/users',userRouter)
app.use(authenticate);

app.listen(process.env.port,async()=>{
    try {
        await connection
        console.log("Connected to DB")
    } catch (error) {
        console.log(error)
    }
    console.log("Server is running on port number",process.env.port)
})