const fs = require('fs');
const timeStamp = require('./serverUtility/time.js').timeStamp;
const lib=require('./libUtility.js');
const logger = function(req,res) {
  let logs = ['--------------------------------------------------------------',
    `${timeStamp()}`,
    `${req.method}`,
    `${req.url}`,
    `${JSON.stringify(req.headers,null,2)}`,
    ''
  ].join('\n');
  console.log(`${req.method}  ${req.url}`);
  fs.appendFile('./request.log',logs,()=>{});
}

const serveStaticPages=function(req,res){
  let file='./public'+req.url;
  let fileExtension=lib.getContentType(file);
  if(!lib.isFile(fs,file)){
    res.handleInvalidUrl('page not found');
    return;
  }
  res.setHeader('Content-Type',fileExtension);
  content=fs.readFileSync(file);
  res.write(content);
  res.end();
}

module.exports={
  logger:logger,
  serveStaticPages:serveStaticPages
}
