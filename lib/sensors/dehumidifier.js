/*
 ThingPlug 2.0 StarterKit(ver 0.1)

 Copyright © 2017 IoT Tech. Lab of SK Telecom All rights reserved.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.

 */

var cnt = 0;
var min = 30;
var max = 80;
var direction = false;

var period = null;

var value = 0;

var status = "on";

module.exports = function(p){
    period = p;
}

module.exports.prototype = {
    humidity : function (){

        var random = Math.random();
    
        if(direction == true){
            value = (min + Math.sin((cnt/1000)*period) * (Math.abs(max-min)*1.1) + random*0.1);
        }
        else if(direction == false){
            value = (max - Math.sin((cnt/1000)*period) * (Math.abs(max-min)*1.1) - random*0.1);
        }
        cnt++;

        return parseFloat(value.toFixed(3));
    },
    dehumidifier : function (){
        return status;
    },
    onListen : function (key, value){
        console.log("Device Control, "+"key : " + key + ", value : " + value);
        status = value;
    }
}






