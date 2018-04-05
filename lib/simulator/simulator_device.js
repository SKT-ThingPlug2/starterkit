'use strict';

var colors = require('colors');
var async = require('async');

var apiHandler = require('./../apihandler'); 

module.exports = function(app){
    var configObject = this;
    var api = new apiHandler("device", configObject); //API정보 생성
    
    //------------------------//
    console.log(colors.green('### ThingPlug 2.0 virtual Device###'));
    //========================//
    async.waterfall([
        function(cb) {  
            api.login(cb); //login 통한 X-authorization 추가
        },
        function(result, cb) {  
            api.getService(cb); //서비스 획득 API 호출
        },
        function(result,cb) {  
            if(result.code == 104 && result.message == "SERVICE"){
                console.log(colors.yellow("no Service in Platform"));     
                api.createService(cb); // 가상 서비스 생성 API 호출
            }
            else
                cb(null, result);
        },
        function(result, cb) {  
            api.getDevice(cb); //서비스 획득 API 호출
        },
        function(result, cb) {  
            if(result.code == 104 && result.message == "DEVICE"){
                console.log(colors.yellow("no Device in Platform Service"));     
                api.createDevice(cb); // 가상 서비스 생성 API 호출
            }
            else
                cb(null, result);
        },
        function(result, cb) {  
            api.getDeviceCredential(cb); //디바이스 token 획득 API호출
        },
        function(token,  cb) {
            api.createDeviceDataInterval(cb); //디바이스 telemetry Data 주기보고 전달
        },
        function(token,  cb) {
            api.createDeviceAttribute(null, cb);  //디바이스 attribute Data 전달
        }
        ], function (err, result) {
        // result now equals 'done' 
    });
}