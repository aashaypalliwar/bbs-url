const http = require('http');
const app = require('./app');
const config = require('./utils/config');
const mongoose = require('mongoose');

const server = http.createServer(app);

console.log("Starting app..");
console.log("Waiting for connection to MongoDB");

console.log(config.MONGODB_URI);

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connected to MongoDB!");
    console.log("Starting webserver..");
    server.listen(config.PORT,()=>{
        console.log(`Server is running on port ${config.PORT}`)
    });
}).catch(() => {
    console.log("Could not connect to MongoDB server! Shutting down...");
    process.exit(1);
});

//
// server.listen(config.PORT,()=>{
//     console.log(`Server is running on port ${config.PORT}`)
// });
