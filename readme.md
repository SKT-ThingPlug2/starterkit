# ThingPlug 2.0 StarterKit (ver 0.1)

본 tool은 nodejs로 작성된 test code로서 개발용도로 사용바랍니다.
실 단말 또는 서비스의 API 호출을 하여 문제가 발생하는 경우 책임을 지지 않습니다.

## device.js 실행 argument 

-h ThingPlug HostIP (default : test.sktiot.com)<br/>
<br/>
-u userName : ThingPlug 사용자 이름 (default : fail)<br/>
-p password : ThingPlug 사용자 비밀번호 - token발급을 위해 필요(default : fail)<br/>
-s serviceName : 서비스 이름 (default : fail)<br/>
-d deviceName : 디바이스 이름 (default : StarterKitDevice)<br/>
-r DataRate : 데이터 보내는 주기(초) (default : 60)<br/>
-e sensorNodeEntity : 센서노드명 (Airconditioner, Dehumidifier, GPS, Logistics, Barricade) (no default)<br/><br/>

-t timeout : 가상 디바이스의 생존시간(초) (default : unlimited)<br/>

--help 사용법<br/>

### ex) node device.js -u test1 -p password -e Airconditioner,GPS,Logistics -s testService -h test.sktiot.com

<br/>
<br/>

## Sensor, Actuator Info (descriptor.js에 정의)
### telemetry json key, value type
|센서노드명        | 센서명(telemetry key)     | telemetry value type | 
|---------------|---------------------------|---------------------|
|Airconditioner | temperature               | int                 |
|Dehumidifier   | humidity                  | int                 |
|GPS            | latitude                  | string              |
|GPS            | longitude                 | string              |
|Logistics      | infrared                  | int                 |
|Barricade      | bar                       | int                 |

<br/>

### attribute json key, value type
|센서노드명        | 센서명(attribute key)     | attribute value type     | 
|--------------|---------------------------|------------------------|
|airconditioner | airconditioner            | string("on", "off")    |
|dehumidifier   | dehumidifier              | string("on", "off")    |
|gps            | gps                       | string                 |
|barricade      | barricade                 | string("on", "off")    |



<br/>

### 프로토콜
Device 생성, 삭제, 토큰 관리는 HTTP<br/>
TelemetryData전달 : HTTP, MQTT (선택)<br/>
제어메시지 : MQTT down Topic 메시지(추후 적용)


## application.js 실행 argument 

-h ThingPlug HostIP (default : test.sktiot.com)<br/>
<br/>
-u userName : ThingPlug 사용자 이름 (default : fail)<br/>
-p password : ThingPlug 사용자 비밀번호 - token발급을 위해 필요(default : fail)<br/>
-s serviceName : 서비스 이름 (default : fail)<br/>
-d deviceName : 디바이스 이름 (default : StarterKitDevice)<br/>
-r DataRate : 데이터 받는 주기(초) (default : 60)<br/>
--tele Telemtry Key : Telemetry를 받고자 하는 Key값 (--tele=humidity,temperature...) (default : all)<br/><br/>
--attr Attribute Key : Attribute 받고자 하는 Key값 (--attr=airconditioner,dehumidifier...) (default : all)<br/><br/>
--set Telemtry Key : 디바이스 제어 명령 (--set=key:value,aircontitioner:off,gps:on...) (default : null)<br/><br/>

-t timeout : 샘플 어플리케이션의 생존시간(초) (default : unlimited)<br/>

--help 사용법<br/>

### ex) node application -u testUser -s testService -r 3 -p password -d testDevoce -t 10 --tele=humidity,temperature --set=dehumidifier:on

## config.js 예시 (또는 config json format )

~~~javascript
//json config를 별도로 작성한 경우(config.js.sample 활용)
var config = require('./lib/config');

//또는
var config = {      //config.js활용가능
    "userName" : "myuser",  //mandatory
    "userPassword" : "mypassword", //mandatory
    "serviceName" : "myservice", //mandatory
    "deviceName" : "mydevice", //mandatory
    "deviceDescriptorName" : "mydescriptor", //descriptor 정보 획득시 필요

    "sensorNodeEntity" : ["airconditioner", "gps"], //device api mandatory

    "tele" : ["humidity", "temperature"], //getlatestTelemetry시 필요한 값만 받고자 하는 경우
    "attr" : ["airconditioner", "gps"], //getDeviceAttribute시 필요한 값만 받고자 하는 경우
    "set" : "airconditioner:off", //simulator 시작시 단말 제어를 보내고자 하는 경우

    "protocol" : "mqtt", //device telemetry 전달 프로토콜(mqtt, http / default : mqtt)

    "accessToken" : "myaccessToken", //login시 발급 가능
    "deviceToken" : "mydeviceToken", //getDeviceCredential시 발급 가능

    "dataRate" : 3, //default 60s
    "timer" : 10 //default null
};

~~~

## library 활용법

### Simulator 활용

~~~javascript

//cli argument를 활용하는 경우
var app = require('./lib/index'); (상대 구조는 추후 변경 예정)
app.simulator("application", null); (가상 application 생성 및 실행)
app.simulator("device", null); (가상 device 생성 및 실행)

//json config를 별도로 작성한 경우(config.js.sample 활용)
var app = require('./lib/index'); // (상대 구조는 추후 변경 예정)
var config = require('./config'); // config object

app.simulator("application", config); (가상 application 생성 및 실행)
app.simulator("device", config); (가상 device 생성 및 실행)

~~~

### ThingPlug Application API 활용

~~~javascript

//cli argument를 활용하는 경우
var app = require('./lib/index'); //(상대 구조는 추후 변경 예정)
var applicationApi = app.api("application", null); //(가상 application의 api 호출 준비)

//json config를 별도로 작성한 경우(config.js.sample 활용)
var app = require('./lib/index'); //(상대 구조는 추후 변경 예정)
var config = require('./config'); // config object
var applicationApi = app.api("application", config); //(가상 application의 api 호출 준비)

applicationApi.login(function(err, result){
    //result로 API 수행 결과 전달
}); //

applicationApi.getlatestInterval(function(err, result){
    //result로 API 수행 결과 전달
}); //

applicationApi.getTelemetryLatest(function(err, result){
    //result로 API 수행 결과 전달
}); //

applicationApi.getService(function(err, result){
    //result로 API 수행 결과 전달
}); //

applicationApi.getDevice(function(err, result){
    //result로 API 수행 결과 전달
}); //

applicationApi.getDeviceDescriptor(function(err, result){
    //result로 API 수행 결과 전달
}); //

applicationApi.setAttribute(attribute, function(err, result){
    //result로 API 수행 결과 전달
}); //

~~~


### ThingPlug Device API 활용

~~~javascript

//cli argument를 활용하는 경우
var app = require('./lib/index'); //(상대 구조는 추후 변경 예정)
var deviceApi = app.api("device", null); //(가상 device api 호출 준비)

//json config를 별도로 작성한 경우(config.js.sample 활용)
var app = require('./lib/index'); //(상대 구조는 추후 변경 예정)
var config = {      //config.js활용가능
    "userName" : "myuser",
    "userPassword" : "mypassword",
    "serviceName" : "myservice",
    "dataRate" : 3, //3 seconds
    "deviceName" : "mydevice",
    "sensorNodeEntity" : ["airconditioner", "gps"],
    "timer" : 10 //10 seconds
};

var deviceApi = app.api("device", config); //(가상 device api 호출 준비)

deviceApi.createDeviceTelemetry(telemetry, function(err, result){
    //result로 API 수행 결과 전달
}); //

deviceApi.createDeviceAttribute(attribute, function(err, result){
    //result로 API 수행 결과 전달
}); //

~~~


<br/>
<br/>

