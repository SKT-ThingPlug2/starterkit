var colors = require('colors');

var mqtt = require('mqtt');
var descriptor = require('./descriptor');

var telemetryTopic;
var attributeTopic;
var subscribeTopic;

var client;

var self = this;

var obj = new Object();


module.exports = function(baseObj){
    obj = baseObj;
    telemetryTopic = "v1/dev/" + obj.serviceName + "/" + obj.deviceName + "/telemetry";
    attributeTopic = "v1/dev/" + obj.serviceName + "/" + obj.deviceName + "/attribute";
    console.log(colors.cyan("telemetryTopic : ") + telemetryTopic);
    
    client = mqtt.connect('mqtt://'+obj.host, {
        username: obj.deviceToken,
        clean: false,
        clientId: obj.deviceToken
     });


    client.on('connect', function () {
        console.log(colors.green('### mqtt connected ###'));

        //Subscribe Declaration
        //플랫폼에서 device로 제어 명령을 보내는 채널
        subscribeTopic = "v1/dev/"+obj.serviceName+"/"+obj.deviceName+"/down";
        client.subscribe(subscribeTopic);	
        console.log(colors.cyan('subscribe topic : ') + subscribeTopic);    
    });


    client.on('close', function(){
        console.log(colors.red('### mqtt disconnected ###'));
    });    

    client.on('error', function(error){
        console.log(colors.red(error));
        process.emit('psKill', error);
    });

    client.on('message', function(topic, message){
    //topic별 분리
    //message Parse
        // console.log(colors.bgYellow("Push Topic") + " : " + topic);
        console.log(colors.bgYellow("Push Message") + " : " + message);

        // message내 attribute를 확인하여 특정 센서로 전달
        var attr = JSON.parse(message).attribute;
        var keys = Object.keys(attr);
        keys.forEach(function(k) {
            descriptor[k].deviceData.jsonForm.attributes.forEach(function(value){
                obj.sensors[value.name].onListen(k, attr[k]);
            });
        });
        
        process.emit('command', topic, JSON.parse(message));
        client.publish(attributeTopic, JSON.stringify(attr), { qos: 0 });
        
    });

}


module.exports.prototype = {
    telemetry : function (value){
        client.publish(telemetryTopic, JSON.stringify(value), { qos: 0 });
    },
    attribute : function (value){
        client.publish(attributeTopic, JSON.stringify(value), { qos: 0 });
    }
}