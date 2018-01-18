const fs = require('fs');
const timeStamp = require('./serverUtility/time.js').timeStamp;
const lib = require('./libUtility.js');
const CommentHandler = require('./serverUtility/commentHandler.js');
let commentHandler = new CommentHandler('./data/comments.JSON');

const registered_users = [{
  userName: 'dhana',
  name: 'dhanashri'
}]

const logger = function(req, res) {
  let logs = ['--------------------------------------------------------------',
    `${timeStamp()}`,
    `${req.method}`,
    `${req.url}`,
    `${JSON.stringify(req.headers,null,2)}`,
    ''
  ].join('\n');
  console.log(`${req.method}  ${req.url}`);
  fs.appendFile('./request.log', logs, () => {});
}

const serveStaticPages = function(req, res) {
  let file = './public' + req.url;
  let fileExtension = lib.getContentType(file);
  if (!lib.isFile(fs, file)) {
    res.handleInvalidUrl('page not found');
    return;
  }
  res.statusCode = 200;
  res.setHeader('Content-Type', fileExtension);
  content = fs.readFileSync(file);
  res.write(content);
  res.end();
}

const processLogIn = (req, res) => {
  let user = registered_users.find(u => u.userName == req.body.userName);
  if (!user) {
    res.setHeader('Set-Cookie', `message=login Failed; Max-Age=5`);
    res.redirect('/login.html');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/guestBook');
};

const getLogInPage = function(req, res) {
  let logInPage = fs.readFileSync('./public/login.html', 'utf8');
  logInPage = logInPage.replace('Login_Message', req.cookies.message || '');
  res.setHeader('Content-Type', 'text/html');
  if (req.user && req.cookies.sessionid) {
    logInPage='<h2>You are already Login<a href="index.html"><br><<</a></h2>';
  }
  res.write(logInPage);
  res.end();
  return;
}

const processLogOut = function(req, res) {
  if (!req.user) {
    res.redirect('/login');
    return;
  }
  res.setHeader('Set-Cookie', '');
  delete req.user.sessionid;
  res.redirect('/index.html');
};

const loadComments = (req, res) => {
  res.setHeader('Content-type', 'text/html');
  res.write(commentHandler.loadComments());
  res.end();
  return;
};

const loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  let user = registered_users.find(u => u.sessionid == sessionid);
  if (sessionid && user) {
    req.user = user;
  }
};

const redirectLoggedInUserToHome = (req, res) => {
  if (req.urlIsOneOf(['/login', '/guestBook.html']) && req.user) {
    res.redirect('/guestBook');
  }
}

const redirectLoggedOutUserToLogin = (req, res) => {
  if (req.urlIsOneOf(['/logout']) && !req.user) res.redirect('/login');
}

const getCommentBox = (req, res) => {
  res.setHeader('Content-type', 'text/html');
  res.write(commentHandler.postGuestBook(req.user.name));
  res.end();
  return;
};

const serveGuestBook = (req, res) => {
  let GuestData = req.body;
  GuestData.name = req.user.name;
  commentHandler.storeComment(GuestData);
  res.setHeader('Content-type', 'text/html');
  res.write(commentHandler.postGuestBook(GuestData.name));
  res.end();
}

module.exports = {
  logger: logger,
  serveStaticPages: serveStaticPages,
  getLogInPage: getLogInPage,
  processLogIn: processLogIn,
  processLogOut: processLogOut,
  loadComments: loadComments,
  getCommentBox: getCommentBox,
  loadUser: loadUser,
  serveGuestBook: serveGuestBook,
  redirectLoggedInUserToHome: redirectLoggedInUserToHome,
  redirectLoggedOutUserToLogin: redirectLoggedOutUserToLogin
}
