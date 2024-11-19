const express = require('express');
const sequelize = require('./db');
const studentRoutes = require('./routes/wasm-route');
const cors=require('cors');




const app =express();
const PORT = 3001;


const corsOption={
    origin:'http://localhost:3000',
    optionsSuccessStatus: 200,
	credentials: true
}
//cors 
app.use(cors(corsOption))

//Middleware
app.use(express.json());

//Routes
app.use('/api/',studentRoutes);

//connect to db and start server

sequelize.authenticate()
        .then(()=>{
            console.log("connected to the database");
            app.listen(PORT,()=>{
                console.log(`Server running on http://localhost:${PORT}`);
                
            })
        }).catch(err => {
            console.error('unable to connect',err);
        })