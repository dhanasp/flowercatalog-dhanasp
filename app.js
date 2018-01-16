const lib=require('./libUtility.js');
const handler=require('./handlers.js');
const logger=handler.logger;
const serveStaticPages=handler.serveStaticPages;
const webApp = require('./webapp.js');


const app=webApp.create();
app.use(logger);
app.get('/',(req,res)=>req.url='/index.html');
app.post('/login',);
app.usePostprocess(serveStaticPages);
exports.app=app;
