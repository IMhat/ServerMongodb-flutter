require('dotenv').config(); // load env

// importing packages 
const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');

// importing from files
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

// init 
const PORT = process.env.PORT || 3000;
const app = express();
const DB = process.env.DB_URL;

// middleware
app.use(express.json())
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);


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
