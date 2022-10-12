// importing packages 
const express = require('express');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');

// importing from files
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

// init 
const PORT = 3000;
const app = express();
const DB = "mongodb+srv://MateoMaster:MateoMaster@cluster0.4wggvc5.mongodb.net/?retryWrites=true&w=majority"

// middleware

app.use(cors()); 

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));



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


app.listen(PORT,"0.0.0.0", ()=> {
    console.log(`connected at port ${PORT}`);
});
