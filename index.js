require('dotenv').config(); // load env

const cors = require('cors');

// importing packages 
const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');

// importing from files
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');
const transactionRouter = require('./routes/transaction');

// init 
const PORT = process.env.PORT || 3000;
const app = express();
const DB = process.env.DB_URL;


app.all('*', function(req, res, next){
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", 'X-Requested-With');
    next();
});

app.use(cors({
origin: 'https://vocal-pastelito-f96590.netlify.app'
    
}))

// middleware
app.use(express.json())
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);
app.use(transactionRouter);




// connection to mongoDB
mongoose
    .connect(DB)
    .then(() => {
        console.log('connection successful');
    })
    .catch((e) => {
        console.log(e); 
    });


app.listen(PORT, ()=> {
    console.log(`connected at port ${PORT}`);
});
