'use strict';

var colors = require('colors');
var async = require('async');

var apiHandler = require('./../apihandler'); 

module.exports = function(app){
    var configObject = this;
    var api = new apiHandler("application", configObject); //API정보 생성    
    //------------------------//
    console.log(colors.green('### ThingPlug 2.0 Sample Application###'));
    //========================//
    async.waterfall([
        function(cb) {  
            api.login(cb); //login 통한 X-authorization 추가
        },
        function(result, cb) {  
            api.getService(cb); //서비스 획득 API 호출
        },
        function(token,  cb) {
            api.setAttribute(null, cb); //Attribute 설정
        },
        function(token,  cb) {
            api.getlatestInterval(cb); //디바이스 telemetry Data 주기보고 획득
        }
        ], function (err, result) {
        // result now equals 'done' 
    });
}