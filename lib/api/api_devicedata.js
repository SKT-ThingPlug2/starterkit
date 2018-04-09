
var obj = new Object();
var httpReq = require('./../promise-http').request;
var colors = require('colors');

var fs = require('fs'); 
var mqtt = require('./../mqtt');
var mqttClient;

var descriptor = require('./../descriptor');


var initializer = {};

var that = null;

module.exports = function(baseObj){
    obj = baseObj;

    obj["sensors"] = {};
    obj.sensorNodeEntity.forEach(function(entity){
        initializer[entity] = require('./../sensors/'+entity);
        obj.sensors[entity] = new initializer[entity](baseObj.dataRate); 
    });
}
module.exports.prototype = {
    createDeviceDataInterval : function(cb){
        that = this;
        setInterval(function() {that.createDeviceTelemetry(null, cb);}, obj.dataRate * 1000);
        return cb(null, "ok")
    },
    createDeviceTelemetry : function(telemetry, cb) {
        var telemetryData;
        if(telemetry == null)
            telemetryData = telemetries();
        else
            telemetryData = telemetry;
         console.log(colors.bgMagenta("telemetry Data") + " : " + JSON.stringify(telemetryData));
         if(obj.protocol == "http"){
            httpReq({
                options : {
                    host: obj.host,
                    port: obj.port,
                    path : '/api/v1/dev/'+obj.serviceName+'/'+obj.deviceName+'/telemetry',
                    method: 'POST',
                    headers : {
                        'Content-Type': 'application/json',
                        'X-Authorization': obj.deviceToken
                    }
                },
                body : telemetryData
            }).then(function(result){
                if (result.data) {
                    //console.log(result.data);
                    if(!that) return cb(null, result);
                }
                else {
                    //console.log(result);
                    if(!that) return cb(result, null);
                }
            }, function (result) {
                console.log(result);
                if(!that) return cb(result, null);
            });
         }
         else if(obj.protocol == "mqtt"){
            setMqtt();
             mqttClient.telemetry(telemetryData);
         }

    },

    //DeviceAttribute 전달
    //sensor, attrName, value type은 descriptor에 정의
    //sensor : Airconditioner, Dehumidifier, GPS, Logistics, Barricade
    createDeviceAttribute : function(attribute, cb) {
        var attributeData;
        if(attribute == null)
            attributeData = attributes();
        else
            attributeData = attribute;
         console.log(colors.bgMagenta("attribute Data") + " : " + JSON.stringify(attributeData));
         if(obj.protocol == "http"){
            httpReq({
                options : {
                    host: obj.host,
                    port: obj.port,
                    path : '/api/v1/dev/'+obj.serviceName+'/'+obj.deviceName+'/attribute',
                    method: 'POST',
                    headers : {
                        'Content-Type': 'application/json',
                        'X-Authorization': obj.deviceToken
                    }
                },
                body : attributeData
            }).then(function(result){
                if (result.data) {
                    if(!that) return cb(null, result);
                }
                else {
                    console.log(result);
                    if(!that) return cb(result, null);
                }
            }, function (result) {
                console.log(result);
                if(!that) return cb(result, null);
            });
        }         
        else if(obj.protocol == "mqtt"){
            setMqtt();
            mqttClient.attribute(attributeData);
        }
    },
}

var telemetries = function(){
    var telemetryData = [];
    obj.sensorNodeEntity.forEach(function(entity){
            var telemetry = {};
            descriptor[entity].deviceData.jsonForm.telemetries.forEach(function(value){
                telemetry[value.name] = obj.sensors[entity][value.name]();
            });
            telemetryData.push(telemetry);
    });
    return telemetryData;
}

var attributes = function(){
    var attributeData = [];
    obj.sensorNodeEntity.forEach(function(entity){
            var attribute = {};
            descriptor[entity].deviceData.jsonForm.attributes.forEach(function(value){
                attribute[value.name] = obj.sensors[entity][value.name]();
            });
            attributeData.push(attribute);
    });
    return attributeData;
}

var setMqtt = function(){
    if(obj.protocol == "mqtt" && mqttClient == null){
        mqttClient = new mqtt(obj);
    }
}
