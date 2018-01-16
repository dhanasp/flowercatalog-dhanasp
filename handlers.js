const fs = require('fs');

const logger = function(fs,req,res) {
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

const getLoginPage=function(req,res){
  fs.readFileSync('./')
}
