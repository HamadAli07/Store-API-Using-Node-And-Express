require ('dotenv').config();
require('express-async-errors');
const connectDB = require('../starter/db/connect');
const express = require('express');
const app = express();

const notfound = require ('../starter/middleware/not-found');
const errorMiddleWare = require ('../starter/middleware/error-handler');
const productRouter = require('../starter/routes/products');

//middleware 
app.use(express.json());

//routes
app.get('/',(req,res)=> {
    res.status(200).send('<h1>Store API</h1> <a href="/api/v1/products">Prdoducts</a>');
})

app.use('/api/v1/products', productRouter);


//product routes
app.use(notfound);
app.use(errorMiddleWare);

//port
const port = process.env.PORT || 3000;

const start = async (req,res) => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(port, ()=> console.log('server is listening to port 3000.'));
    }
    catch (error) {
        console.log(error);
    }
}

start()
