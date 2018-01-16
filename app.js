const timeStamp = require('./serverUtility/time.js').timeStamp;
const handler=require('./handler.js');
const logger=handler.logger;
const getLoginPage=handler.getLoginPage;
const app=require('./app.js');

app.use(logger(req,res));
app.get('/',()=>req.url='/login');
app.post('/login',getLoginPage(req,res));
// app.get('')
