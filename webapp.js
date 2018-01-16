
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
 this._postProcesses = [];
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

const usePostProcess = function(postProcess) {
 this._postProcesses.push(postProcess);
}

let urlIsOneOf = function(urls){
 return urls.includes(this.url);
}

const runPostProcessors = function(postProcessors,req,res) {
 postProcessors.forEach(function(process){
   if(res.finished) return;
   process(req,res);
 })
}

const main = function(req,res){
 let parsedUrl= url.parse(req.url,true);
 req.url = parsedUrl.pathname;
 req.queryParams = parsedUrl.query;
 res.redirect = redirect.bind(res);
 req.urlIsOneOf = urlIsOneOf.bind(req);
 req.cookies = parseCookies(req.headers.cookie||'');
 let content="";
 console.log(req.url);
 console.log(req.method)
 req.on('data',data=>content+=data.toString())
 req.on('end',()=>{
   req.body = parseBody(content);
   content="";
   this._preprocess.forEach(middleware=>{
     if(res.finished) return;
     middleware(req,res);
   });
   if(res.finished) return;
   invoke.call(this,req,res);
   if(res.finished) return;
   runPostProcessors(this._postProcesses,req,res);
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
 rh.usePostProcess=usePostProcess;
 return rh;
}
exports.create = create;
