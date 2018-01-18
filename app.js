const lib = require('./libUtility.js');
const handler = require('./handlers.js');
const logger = handler.logger;
const loadUser=handler.loadUser;
const redirectLoggedInUserToHome=handler.redirectLoggedInUserToHome;
const redirectLoggedOutUserToLogin=handler.redirectLoggedOutUserToLogin;
const serveStaticPages = handler.serveStaticPages;
const getLogInPage=handler.getLogInPage;
const loadComments=handler.loadComments;
const processLogIn=handler.processLogIn;
const getCommentBox=handler.getCommentBox;
const serveGuestBook  =handler.serveGuestBook ;
const processLogOut=handler.processLogOut;
const webApp = require('./webapp.js');


const app = webApp.create();
app.use(logger);
app.use(loadUser);
app.use(redirectLoggedInUserToHome);
app.use(redirectLoggedOutUserToLogin);
app.get('/', (req, res) => req.url = '/index.html');
app.get('/guestBook.html',loadComments);
app.get('/login.html',getLogInPage);
app.post('/login',processLogIn);
app.get('/logout',processLogOut);
app.get('/guestBook',getCommentBox);
app.post('/addComments',serveGuestBook)
app.usePostprocess(serveStaticPages);
exports.app = app;
