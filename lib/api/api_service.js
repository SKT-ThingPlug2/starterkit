var obj = new Object();
var httpReq = require('./../promise-http').request;
var colors = require('colors');

module.exports = function(baseObj){
    obj = baseObj;
}
module.exports.prototype = {
    createService : function (cb){
        httpReq({
            options : {
                host: obj.host,
                port: obj.port,
                path : '/api/v1/services',
                method: 'POST',
                headers : {
                    'Content-Type': 'application/json',
                    'X-Authorization': obj.accessToken
                }
            },
            body : {
                "serviceName": obj.serviceName,
                "isProd":false,
                "retention": 100,
                "retentionUnit": "HOUR",
                "category": "Wellness",
                "ownerUserName": obj.userName,
                "visibility": "PRIVATE",
                "charging": false,
                "state": "ACTIVE",
                "deviceLimit": 10,
                "memberLimit": 10,
                "subscriptionLimit": 10,
                "terminateDate": "2099-12-31 23:59:59",
                "description": "StarterKit Sample Service",
                "regType": "B2C"
              }
        }).then(function(result){
            if (result.data) {
                console.log(colors.cyan('Create Service : ') + result.data);
                return cb(null, result.data);
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
    //가상 서비스 정보 확득
    getService : function (cb){
        httpReq({
            options : {
                host: obj.host,
                port: obj.port,
                path : '/api/v1/services/'+obj.serviceName,
                method: 'GET',
                headers : {
                    'X-Authorization': obj.accessToken
                }
            }
        }).then(function(result){
            if (result.data) {
                var jsonResult = JSON.parse(result.data);
                return cb(null, jsonResult);
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
    //가상 서비스 삭제
    deleteService : function (cb){
        httpReq({
           options : {
               host: obj.host,
               port: obj.port,
               path : '/api/v1/services/'+obj.serviceName,
               method: 'DELETE',
               headers : {
                   'X-Authorization': obj.accessToken
               }
           }
       }).then(function(result){
           if (result != null) {
               console.log('Delete Service : ' + result.data);
               return cb(null, result.data);
           }
           else {
               console.log('Delete Service : ' + result);
               return cb(result, null);
           }
       }, function (result) {
           process.exit();
           return cb(result, null);
       });
    }
}