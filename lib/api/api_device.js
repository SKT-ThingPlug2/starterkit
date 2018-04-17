var obj = new Object();
var httpReq = require('./../promise-http').request;
var colors = require('colors');
var descriptor = require('./../descriptor');

var that = null;

module.exports = function(baseObj){
    obj = baseObj;
}
module.exports.prototype = {
    createDevice : function (cb){
        httpReq({
           options : {
               host: obj.host,
               port: obj.port,
               path : '/api/v1/services/'+obj.serviceName+'/devices',
               method: 'POST',
               headers : {
                   'Content-Type': 'application/json',
                   'X-Authorization': obj.accessToken
               }
           },
           body : {
            "deviceName": obj.deviceName,
            "ownerUserName": obj.deviceOwnerName,
            "visibility": true,
            "state": "ACTIVE",
            "isGateway": false,
            "displayName": obj.deviceName,
            "deviceDescriptorName": descriptor.default.deviceDescriptorName
          }
       }).then(function(result){
           if (result.data) {
               console.log(colors.cyan('Create Device : ') + result.data);
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
    getDevice : function (cb){
        httpReq({
           options : {
               host: obj.host,
               port: obj.port,
               path : '/api/v1/services/'+obj.serviceName+'/devices/'+obj.deviceName,
               method: 'GET',
               headers : {
                   'Content-Type': 'application/json',
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
    deleteDevice : function (cb){
        httpReq({
           options : {
               host: obj.host,
               port: obj.port,
               path : '/api/v1/services/'+obj.serviceName+'/devices/'+obj.deviceName,
               method: 'DELETE',
               headers : {
                   'Content-Type': 'application/json',
                   'X-Authorization': obj.accessToken
               }
           }
       }).then(function(result){
           if (result != null) {
               console.log('Delete Device : ' + result.data);
               return cb(null, result.data);
           }
           else {
               console.log('Delete Device : ' + result);
               return cb(result, null);
           }
       }, function (result) {
           process.exit();
           return cb(result, null);
       });
    },
    createDeviceDescriptor : function (cb){
        obj.sensorNodeEntity.forEach(function(entity){
            descriptor[entity].deviceData.jsonForm.telemetries.forEach(
                function(t){ descriptor.default.deviceData.jsonForm.telemetries.push(t); });
            descriptor[entity].deviceData.jsonForm.attributes.forEach(
                function(a){ descriptor.default.deviceData.jsonForm.attributes.push(a); });
        });
        obj.deviceDescriptorName = descriptor.default.deviceDescriptorName;
        httpReq({
           options : {
               host: obj.host,
               port: obj.port,
               path : '/api/v1/services/'+obj.serviceName+'/device-descriptors',
               method: 'POST',
               headers : {
                   'Content-Type': 'application/json',
                   'X-Authorization': obj.accessToken
               }
           },
           body : descriptor.default
       }).then(function(result){
           if (result.data) {
               console.log(colors.cyan('Create Device Descriptor : ') + result.data);
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
     //디바이스 디스크립터 정보 획득(정의된 경우 사용)
     getDeviceDescriptor : function (cb){
        httpReq({
           options : {
               host: obj.host,
               port: obj.port,
               path : '/api/v1/services/'+obj.serviceName+'/device-descriptors/'+descriptor.default.deviceDescriptorName,
               method: 'GET',
               headers : {
                   'Content-Type': 'application/json',
                   'X-Authorization': obj.accessToken
               }
           }
       }).then(function(result){
           if (result.data) {
               var jsonResult = JSON.parse(result.data);
               var telemetries = JSON.parse(result.data).telemetries;
               // Array형태, name, type 추출 및 저장
               var attributes = JSON.parse(result.data).attributes;
               // Array형태, name, type 추출 및 저장
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
    getLatestInterval : function(cb){
        that = this;
        if((obj.attr && obj.tele) || (!obj.attr && !obj.tele)){
            setInterval(this.getAttribute, obj.dataRate * 1000);  
            setInterval(this.getTelemetryLatest, obj.dataRate * 1000);  
        }
        else{
            if(obj.attr)
                setInterval(this.getAttribute, obj.dataRate * 1000);  
            else if(obj.tele)
                setInterval(this.getTelemetryLatest, obj.dataRate * 1000);  
        }
        return cb(null, "ok")
    },
    getAttribute: function (cb){
        var query = "";
        if(obj.attr) query+='?attribute='+obj.attr;
        httpReq({
           options : {
               host: obj.host,
               port: obj.port,
               path : '/api/v1/dev/'+obj.serviceName+'/'+obj.deviceName+'/attribute'+query,
               method: 'GET',
               headers : {
                   'Content-Type': 'application/json',
                   'X-Authorization': obj.accessToken
               }
           }
       }).then(function(result){
           if (result.data) {
               console.log(colors.bgMagenta("Attribute") + " : " + result.data);

               if(!that) return cb(null, JSON.parse(result.data));
           }
           else {
                console.log(result);
                if(!that) return cb(result, null);
           }
       }, function (result) {
           console.log(result);
           if(!that) return cb(result, null);
       });
   },
   getTelemetryLatest: function (cb){
        var query = "";
        if(obj.tele) query+='?telemetry='+obj.tele;
        httpReq({
           options : {
               host: obj.host,
               port: obj.port,
               path : '/api/v1/dev/'+obj.serviceName+'/'+obj.deviceName+'/telemetry/latest'+query,
               method: 'GET',
               headers : {
                   'Content-Type': 'application/json',
                   'X-Authorization': obj.accessToken
               }
           }
       }).then(function(result){
           if (result.data) {
               console.log(colors.bgMagenta("Telemetry") + " : " + result.data);

               if(!that) return cb(null, JSON.parse(result.data));
           }
           else {
                console.log(result);
                if(!that) return cb(result, null);
           }
       }, function (result) {
           console.log(result);
           if(!that) return cb(result, null);
       });
   },
   getDeviceCredential : function(cb){
    httpReq({
       options : {
           host: obj.host,
           port: obj.port,
           path : '/api/v1/services/'+obj.serviceName+'/devices/'+obj.deviceName+'/credential',
           method: 'GET',
           headers : {
               'Content-Type': 'application/json',
               'X-Authorization': obj.accessToken
           }
       }
   }).then(function(result){
       if (result.data) {
           var jsonResult = JSON.parse(result.data);
           console.log(colors.cyan('deviceToken : ') + jsonResult.deviceToken);
           obj.deviceToken = jsonResult.deviceToken;
           return cb(null, obj.deviceToken);
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
    setAttribute : function(attribute, cb){
        if(obj.set!=null || attribute!=null){
            var attributeData;
            if(attribute == null)
                attributeData = attributes(obj.set);
            else
                attributeData = attribute;      
            httpReq({
                options : {
                    host: obj.host,
                    port: obj.port,
                    path : '/api/v1/dev/'+obj.serviceName+'/'+obj.deviceName+'/attribute',
                    method: 'PATCH',
                    headers : {
                        'Content-Type': 'application/json',
                        'X-Authorization': obj.accessToken
                    }
                },
                body : attributeData
            }).then(function(result){
            if (result.data) {
                var jsonResult = JSON.parse(result.data);
                console.log(colors.bgYellow('Set Attribute : ') + result.data);
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
        }
        else return cb(null, "no Attribute");
        },
    getObj : function (){
        return obj;
    },
    getDeviceToken : function (){
        return obj.deviceToken;
    }
}

var attributes = function(attributes){
    var attributeData = {};
    attributes.forEach(function(element) {
        var attribute = element.split(":");
        attributeData[attribute[0]] = attribute[1];
    }, this);
    return attributeData;
}