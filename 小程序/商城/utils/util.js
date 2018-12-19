const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const dataType=obj=>{
  return  Object.prototype.toString.call(obj).slice(8,-1);
}
const log=()=>{
  for(let i in arguments){
    console.log(arguments[i]);
  }
}
module.exports = {
  dataType:dataType,
  formatTime: formatTime,
  log:log
}
