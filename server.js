const http = require('http');
const app= require('./app.js').app;
const PORT = 9090;

let server = http.createServer(app);
console.log(`listening to ${PORT}`);
server.listen(PORT);
