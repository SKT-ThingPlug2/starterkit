# ThingPlug 2.0 StarterKit (ver 0.1)

본 tool은 nodejs로 작성된 test code로서 개발용도로 사용바랍니다.

StarterKit을 활용하여 실 단말 또는 서비스의 API 호출을 하여 문제가 발생하는 경우 책임을 지지 않습니다.

Staging 플랫폼 주소 : test.sktiot.com


## npm 다운로드
nodejs에서 thingplug2-starter-kit을 바로 다운로드 받아 사용 할 수 있습니다.

npm-module 전체 설치 : 
```console
foo@bar:~$ npm install
```

starterkit만 설치 : 
```console
foo@bar:~$ npm install thingplug2-starter-kit
```

## config 설정
플랫폼에서 필요한 configuration을 starterkit에 적용하는 방법은 2가지입니다.

a. CLI Configuration Argument 작성

b. config JSON 작성

>> 2가지 방식 중 1가지만 선택하여 활용하여 주세요. 

## device.js 실행을 위한 argument 

|    long argv     | short argv | 내용                  | default    |  Mandatory  |
|------------------|------------|-----------------------|------------|-------------|
| userName         | -u         | ThingPlug 사용자 이름 | X          | M           |
| password         | -p         | ThingPlug 비밀번호    | X          | M           |
| serviceName      | -s         | ThingPlug 서비스 이름 | X          | M           |
| deviceName       | -d         | ThingPlug 디바이스 명 | StarterKitDevice | O     |
| DataRate         | -r         | 디바이스 데이터 주기(초)| 60       | O           |
| sensorNodeEntity | -e         | 센서 리스트  <br/> (Airconditioner, Dehumidifier, GPS, Logistics, Barricade)          | X          | M           |
| timeout          |            | 가상 디바이스의 생존 시간(초) | X  | O           |
| help             | -h         | argument 사용법       | X          | O           |
| host             |            | 플랫폼 Host           | test.sktiot.com  | O     |
| port             |            | 플랫폼 Port(HTTP)     | 9000       | O           |


### ex) device CLI example 
```console
foo@bar:~$ node device.js -u test1 -p password -e Airconditioner,GPS,Logistics -s testService
```

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


## application.js 실행을 위한 argument 


|    long argv     | short argv | 내용                  | default    |  Mandatory(M/O)  |
|------------------|------------|-----------------------|------------|------------------|
| userName         | -u         | ThingPlug 사용자 이름 |            | M                |
| password         | -p         | ThingPlug 비밀번호    |            | M                |
| serviceName      | -s         | ThingPlug 서비스 이름 |            | M                |
| deviceName       | -d         | ThingPlug 디바이스 명 | StarterKitDevice | O          |
| DataRate         | -r         | 디바이스 데이터 주기(초)| 60       | O                |
| tele             |            | Telemetry를 받고자 하는 Key값      | All | O          |
| attr             |            | Attribute를 받고자 하는 Key값      | All | O          |
| set              |            | 디바이스 제어 명령 (--set=key:value,aircontitioner:off,gps:on...)  |  | O     |
| timeout          |            | 가상 디바이스의 생존 시간(초) |    | O                |
| help             | -h         | argument 사용법       |            | O                |
| host             |            | 플랫폼 Host           | test.sktiot.com  | O          |
| port             |            | 플랫폼 Port(HTTP)     | 9000       | O                |


### ex) application CLI example 
```console
foo@bar:~$ node application -u testUser -s testService -r 3 -p password -d testDevoce -t 10 --tele=humidity,temperature --set=dehumidifier:on
```

## config.js 예시 (또는 config json format )

~~~javascript
//json config를 별도로 작성한 경우(config.js.sample 활용)
var config = require('./config');

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

    "accessToken" : "myaccessToken", //login API 호출 시 자동 발급 가능
    "deviceToken" : "mydeviceToken", //getDeviceCredential API 호출 시 자동 발급 가능

    "dataRate" : 3, //default 60s
    "timer" : 10 //default null
};

~~~

## library 활용법

### Simulator 활용

Simulator는 자동으로 가장의 플랫폼 자원을 생성하고, 동작하는 코드 입니다.

Device Simulator에서는 Service, DeviceDescriptor, Device 정보가 플랫폼에 없는 경우 자동으로 생성하며, 주기적으로 가상 디바이스의 센서 정보를 플랫폼으로 보고합니다.
단말로 Descriptor에 맞는 제어가 오는 경우 status를 업데이트 하기도 합니다.

Application은 Device Simulator(또는 실물 디바이스)의 센서의 최신 데이터를 가져오거나, 디바이스로 제어를 보내게 됩니다.

프로그램 실행시 플랫폼 관련 정보는 상기 설명과 같이 CLI 또는 Config JSON을 활용하여 불러올 수 있습니다.

~~~javascript

//CLI argument를 활용하는 경우
var app = require('thingplug2-stater-kit'); // local >> require('./lib/index');
app.simulator("application", null); // (가상 application 생성 및 실행)
app.simulator("device", null); // (가상 device 생성 및 실행)

//json config를 별도로 작성한 경우(config.js.sample 활용)
var app = require('thingplug2-stater-kit'); // local >> require('./lib/index');
var config = require('./config'); // config object

app.simulator("application", config); // (가상 application 생성 및 실행)
app.simulator("device", config); // (가상 device 생성 및 실행)

~~~

### ThingPlug Application API 활용

Application에서 사용하는 ThingPlug2.0 API를 Wrapping하여 제공합니다.
프로그램 실행시 플랫폼 관련 정보는 상기 설명과 같이 CLI 또는 Config JSON을 활용하여 불러올 수 있습니다.

~~~javascript

//CLI argument를 활용하는 경우
var app = require('thingplug2-stater-kit'); // local >> require('./lib/index'); 
var applicationApi = app.api("application", null); //(가상 application의 api 호출 준비)

//json config를 별도로 작성한 경우(config.js.sample 활용)
var app = require('thingplug2-stater-kit'); // local >> require('./lib/index');  
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

Device에서 사용하는 ThingPlug2.0 API를 Wrapping하여 제공합니다.
프로그램 실행시 플랫폼 관련 정보는 상기 설명과 같이 CLI 또는 Config JSON을 활용하여 불러올 수 있습니다.

~~~javascript

//CLI argument를 활용하는 경우
var app = require('thingplug2-stater-kit'); // local >> require('./lib/index');  
var deviceApi = app.api("device", null); //(가상 device api 호출 준비)

//json config를 별도로 작성한 경우(config.js.sample 활용)
var app = require('thingplug2-stater-kit'); // local >> require('./lib/index');  
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

