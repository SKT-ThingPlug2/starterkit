var colors = require('colors');
var apiHandler = require('./apihandler'); 
var api = null; //API정보 생성

exports.default = function (fn) {
};


exports.default.simulator = function (appType, configObject){
    if(!((appType=="device") || (appType=="application"))){
        console.log(colors.red("Wrong Simulater Type, Type : device, application"));
        process.exit(1);
    }
    var simulator = require('./simulator/simulator_'+appType); 
    simulator.call(configObject);
}
exports.default.api = function (appType, configObject){
    if(!((appType=="device") || (appType=="application"))){
        console.log(colors.red("Wrong Simulater Type, Type : device, application"));
        process.exit(1);
    }
    else if(!api) api = new apiHandler(appType, configObject); //API정보 생성
    return api;
}

module.exports = exports['default'];