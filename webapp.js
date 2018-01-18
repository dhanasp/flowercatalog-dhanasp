const querystring = require('querystring');
const url = require('url');
const toKeyValue = kv=>{
 let parts = kv.split('=');
 return {key:parts[0].trim(),value:parts[1].trim()};
};

const accumulate = (o,kv)=> {
 o[kv.key] = kv.value;
 return o;
};

const parseBody = function(text){
 return querystring.parse(text);
}

let redirect = function(path){
 this.statusCode = 302;
 this.setHeader('location',path);
 this.end();
};

let handleInvalidUrl=function(msg){
  this.statusCode=404;
  this.write(msg);
  this.end();
}

const parseCookies = text=> {
 try {
   return text && text.split(';').map(toKeyValue).reduce(accumulate,{}) || {};
 }catch(e){
   return {};
 }
}

let invoke = function(req,res){
 let handler = this._handlers[req.method][req.url];
 if(!handler){
   return;
 }
 handler(req,res);
}

const initialize = function(){
 this._handlers = {GET:{},POST:{}};
 this._preprocess = [];
 this._postprocesses = [];
};

const get = function(url,handler){
 this._handlers.GET[url] = handler;
}

const post = function(url,handler){
 this._handlers.POST[url] = handler;
};

const use = function(handler){
 this._preprocess.push(handler);
};

const usePostprocess = function(handler) {
 this._postprocesses.push(handler);
}

let urlIsOneOf = function(urls){
 return urls.includes(this.url);
}

const runPreprocessors=function(req,res){
  this._preprocess.forEach(middleware=>{
    if(res.finished) return;
    middleware(req,res);
  });
}

const runPostprocessors = function(req,res) {
  this._postprocesses.forEach(function(process){
   if(res.finished) return;
   process(req,res);
 })
}

const main = function(req,res){
 let parsedUrl= url.parse(req.url,true);
 req.url = parsedUrl.pathname;
 req.queryParams = parsedUrl.query;
 res.redirect = redirect.bind(res);
 res.handleInvalidUrl = handleInvalidUrl.bind(res);
 req.urlIsOneOf = urlIsOneOf.bind(req);
 req.cookies = parseCookies(req.headers.cookie||'');
 let content="";
 // console.log(req.url);
 // console.log(req.methodx)
 req.on('data',data=>content+=data.toString())
 req.on('end',()=>{
   req.body = parseBody(content);
   runPreprocessors.call(this,req,res);
   if(res.finished) return;
   invoke.call(this,req,res);
   if(res.finished) return;
   runPostprocessors.call(this,req,res);
 });
};

let create = ()=>{
 let rh = (req,res)=>{
   main.call(rh,req,res)
 };
 initialize.call(rh);
 rh.get = get;
 rh.post = post;
 rh.use = use;
 rh.usePostprocess=usePostprocess;
 return rh;
}
exports.create = create;
