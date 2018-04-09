var colors = require('colors');
require('date-utils');

var deviceApiHandler = require('./api/api_device');
var serviceApiHandler = require('./api/api_service');
var devicedataApiHandler = require('./api/api_devicedata');
var authApiHandler = require('./api/api_auth');

var deviceApi = null;
var serviceApi = null;
var devicedataApi = null;
var authApi = null;

var baseObject= new Object();
var appType = null;

//-----API 사용을 위한 entity 정의-----//
module.exports = function(app, configObject){

    appType = app;

    if(configObject){
        console.log(colors.cyan("-------Using Objects-------"));
        baseObject = configObject;
    }
    else{
        console.log(colors.cyan("---Using Console Arguments---"));
        var argvOption = require('./util/argv_'+appType);
        var argv = require( 'argv' );
        var args = argv.option(argvOption).run();
        baseObject = args.options;
    }
    
    if(!baseObject.userName){
        console.log(colors.red("Bad Arguments : userName"));
        psKill();
    }
    else if(!baseObject.userPassword){
        console.log(colors.red("Bad Arguments : userPassword"));
        psKill();
    }
    else if(!baseObject.serviceName){
        console.log(colors.red("Bad Arguments : serviceName"));
        psKill();
    }
    baseObject.protocol = "mqtt";
    
    if(!baseObject.host)
        baseObject.host = "test.sktiot.com";
    if(!baseObject.port)
        baseObject.port = "9000";

    console.log(colors.cyan("----------arguments----------"));
    console.log("ThingPlug2.0 Host : "+baseObject.host + ":" + baseObject.port);
    console.log("userName : "+baseObject.userName);
    console.log("serviceName : "+baseObject.serviceName);
    console.log("deviceName : "+baseObject.deviceName);
    if(!baseObject.deviceOwnerName) baseObject.deviceOwnerName = baseObject.userName;
    console.log("deviceOwnerName : "+baseObject.deviceOwnerName);
    console.log("dataRate : "+baseObject.dataRate);
    if(baseObject.dataFormat) console.log("dataFormat : "+baseObject.dataFormat);
    if(baseObject.sensorNodeEntity) {
        for(var i=0; i<baseObject.sensorNodeEntity.length; i++){
            baseObject.sensorNodeEntity[i] = baseObject.sensorNodeEntity[i].toLowerCase();
        }
        console.log("sensorNodeEntity : "+baseObject.sensorNodeEntity);
    }
    if(baseObject.tele) console.log("Telemetries : "+baseObject.tele);
    if(baseObject.attr) console.log("Attributes : "+baseObject.attr);
    if(baseObject.set) console.log("Set Attribute : "+baseObject.set);
    console.log(colors.cyan("-----------------------------"));

    //Process 종료시간 설정
    if(baseObject.timer){
        console.log(colors.bgRed("### This Simulator will be killed after "+baseObject.timer+" seconds ###"));
        setTimeout(psKill, baseObject.timer*1000);
    }  
    process.on('SIGINT', psKill); // ctrl + c로 종료 시 호출
    process.on('SIGTERM', psKill); // pid로 kill 종료 시 호출

    //==========================//

    authApi = new authApiHandler(baseObject);
}

//API Function
module.exports.prototype = {
    //login 및 Authorization Key 획득
    //(개발 단계에서는 Master ID활용)
    //차후 실행시 ID, PW를 받아 실행
    login : function (cb){
        authApi.login(cb);
        baseObject.accessToken = authApi.getAccessToken();
        deviceApi = new deviceApiHandler(baseObject); //디바이스 API정보 생성
        serviceApi = new serviceApiHandler(baseObject); //서비스 API정보 생성
    },
    //가상 디바이스 토큰 획득
    getDeviceCredential : function(cb){
        deviceApi.getDeviceCredential(cb);
        baseObject.deviceToken = deviceApi.getDeviceToken();
        devicedataApi = new devicedataApiHandler(baseObject); //DeviceData(Telemetry, Attribute) API정보 생성
    },

    //
    // Applicaion API 호출 //
    //

    //가상 디바이스의 최신 데이터 주기적 획득
    getlatestInterval : function(cb){
        deviceApi.getLatestInterval(cb);
    },
    //가상 디바이스의 최신 데이터 획득
    getTelemetryLatest: function (cb){
        deviceApi.getTelemetryLatest(cb);
   },
    //가상 서비스 생성
    createService : function (cb){
        serviceApi.createService(cb);
    },
    //가상 서비스 정보 확득
    getService : function (cb){
        serviceApi.getService(cb);
    },
    //가상 서비스 삭제
    deleteService : function (cb){
        serviceApi.getService(cb);
    },
    //가상 디바이스 생성
    createDevice : function (cb){
        deviceApi.createDevice(cb);
    },
    //가상 디바이스 정보 획득
    getDevice : function (cb){
        deviceApi.getDevice(cb);
    },
    //가상 디바이스 삭제
    deleteDevice : function (cb){
        deviceApi.deleteDevice(cb);
    },
    //디바이스 디스크립터 생성
    createDeviceDescriptor : function (cb){
        deviceApi.createDeviceDescriptor(cb);
    },
    //디바이스 디스크립터 정보 획득(정의된 경우 사용)
    getDeviceDescriptor : function (cb){
        deviceApi.getDeviceDescriptor(cb);
    },
    //디바이스 디스크립터 정보 획득(정의된 경우 사용)
    setAttribute : function (attribute, cb){
        deviceApi.setAttribute(attribute, cb);
    },

    //
    //Device Data API 호출
    //
    
    //DeviceTelemetry 전달 (createDeviceDataInterval Function에서 dataRate에 정의한 주기로 호출)
    createDeviceTelemetry : function(telemetry, cb) {
        devicedataApi.createDeviceTelemetry(telemetry, cb);
    },
    //DeviceAttribute 전달
    //sensor, attrName, value type은 description에 정의
    //sensor : Airconditioner, Dehumidifier, GPS, Logistics, Barricade
    createDeviceAttribute : function(attribute, cb) {
        devicedataApi.createDeviceAttribute(attribute, cb);
    },
    //DeviceTelemetry 주기 생성 (createDeviceTelemetry 호출 주기 정의)
    createDeviceDataInterval : function(cb){
        devicedataApi.createDeviceDataInterval(cb);
    }
}

//-------Process 종료---------//
var signal = false;
var psKill = function(){
    if(signal == false){
        signal = true;
        console.log(colors.bgRed("\n###The Simulator has been killed ###"));
        psKill();
        process.exit();
    }
}