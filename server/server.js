const express = require('express');
const sequelize = require('./db');
const studentRoutes = require('./routes/student-route');
const courseRoutes = require('./routes/course-route');
const marksRoutes = require('./routes/marks-route')
const cors = require('cors');




const app = express();
const PORT = 3001;

// Increase timeout for requests
app.use((req, res, next) => {
    req.setTimeout(60 * 60 * 1000); // 10 minutes
    res.setTimeout(60 * 60 * 1000); // 10 minutes
    next();
  });
const corsOption = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    credentials: true
}
//cors 
app.use(cors(corsOption))

//Middleware
app.use(express.json({ limit: '100mb' }));


//Routes
app.use('/api/', studentRoutes);
app.use('/api/', courseRoutes);
app.use('/api/', marksRoutes);

//connect to db and start server

sequelize.authenticate()
    .then(() => {
        console.log("connected to the database");
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);

        })
    }).catch(err => {
        console.error('unable to connect', err);
    })