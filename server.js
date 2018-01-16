const http = require('http');
const webApp= require('/webapp.js');
const PORT = 9090;

app=webApp.create();
let server = http.createServer(app);
console.log(`listening to ${PORT}`);
server.listen(PORT);
