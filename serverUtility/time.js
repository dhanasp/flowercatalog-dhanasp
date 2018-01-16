const timeStamp=function(){
  time=new Date();
  return `${time.toDateString()} ${time.toLocaleString()}`
}
