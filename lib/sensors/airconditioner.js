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

var temperatureMin = 18;	
var sampleCount = 20;
var normalizer = 8;
var maxTemperature = 50;

var a = 0.08;
var y;	
var b = 1;
var altIncrement = 0;	

var iteration = 0;

var period = null;
var direction = true;

var status = "on";
    
function getSeed(max, min){
    var x = Math.round(Math.random() * (max-min)+min);
    return x % normalizer;
}		

module.exports = function(p){
    period = p;
}

module.exports.prototype = {
    temperature : function (){
        // console.log("value : " + AirconRandSeeder.getSeed(i, 100));
        if(direction) altIncrement = (iteration%sampleCount);
        else altIncrement = sampleCount-1-(iteration%sampleCount);
        // polynomial who generates trended values 
        y = temperatureMin+ a*altIncrement*altIncrement + getSeed(b*altIncrement*altIncrement, b*altIncrement/2);
        
        // can't violate max/min values
        if(direction && y > maxTemperature){
            altIncrement = sampleCount;
        }

        // if(direction)
        //     console.log("U [" + altIncrement + "] : " + y);
        // else
        //     console.log("D [" + altIncrement + "] : " + y);

        iteration ++;

        if((iteration%sampleCount) == 0 && iteration != 0)
            direction = !direction;

        return y;
    },
    airconditioner : function (){
        return status;
    },
    onListen : function (key, value){
        console.log("Device Control, "+"key : " + key + ", value : " + value);
        status = value;
    }
}



