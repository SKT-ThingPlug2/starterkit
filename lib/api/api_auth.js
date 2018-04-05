var obj = new Object();
var httpReq = require('./../promise-http').request;
var colors = require('colors');

module.exports = function(baseObj){
    obj = baseObj;
}
module.exports.prototype = {
    login : function (cb){
        httpReq({
           options : {
               host: obj.host,
               port: obj.port,
               path : '/api/v1/login',
               method: 'POST',
               headers : {
                   'Content-Type': 'application/json'
               }
           },
           body : {
            "username": obj.userName,
            "password": obj.userPassword
          }
       }).then(function(result){
           if (result.data) {
                var jsonResult = JSON.parse(result.data);
                if(jsonResult.accessToken){
                    obj.accessToken  = jsonResult.accessToken;
                    console.log(colors.cyan("login Success"));
                }
                else{
                    console.log(result.data);
                }

                return cb(null, JSON.parse(result.data));
           }
           else {
               console.log(result);
               return cb(result, null);
           }
       }, function (result) {
           console.log(result);
           return cb(result, null);
       });
    },
    getObj : function (){
        return obj;
    },
    getAccessToken : function (){
        return obj.accessToken;
    }
}