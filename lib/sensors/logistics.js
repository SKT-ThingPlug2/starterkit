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

var direction = true;
var iteration = 100;
var period = null;

module.exports = function(p){
    period = p;
}

module.exports.prototype = {
    infrared : function (){
        return iteration++;
    }
}







