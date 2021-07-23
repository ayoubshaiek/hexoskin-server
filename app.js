const express = require('express');
const app = express();
require('dotenv/config');
const api = process.env.API_URL;
const morgan = require('morgan');
const mongoose = require('mongoose');
const recordsRouter = require('./routers/records');
const productsRouter = require('./routers/products');
const ordersRouter = require('./routers/orders');
const categoriesRouter = require('./routers/categories');
const usersRouter = require('./routers/users');
const cors= require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');
//const bodyParser =require();
app.use(cors());
app.options('*',cors());
//Middelware

app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);


//Routers
app.use(`${api}/products`, productsRouter);
app.use(`${api}/records`, recordsRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoriesRouter);
app.use(`${api}/users`, usersRouter);

mongoose.connect(process.env.CONNECTION_STRING,{
    useNewUrlParser :true,
    useUnifiedTopology: true,
    dbName: process.env.DBNAME

})
.then(()=>{
    console.log('Database Connection is ready...');
})
.catch((err)=>{
    console.log(err);
})



app.listen(3000 , () => {   
    console.log("server is running http://localhost:3000");
})
