module.exports = [{
    name: 'userName',
    short: 'u',
    type: 'string',
    description: 'Defines an userName (device, application)',
    example: "'script --user=value' or 'script -u value'"
},
{
    name: 'userPassword',
    short: 'p',
    type: 'string',
    description: 'Defines an userPassword (device, application)',
    example: "'script --userPassword=value' or 'script -p value'"
},
{
    name: 'serviceName',
    short: 's',
    type: 'string',
    description: 'Defines an serviceName (device, application)',
    example: "'script --serviceName=value' or 'script -s value'"
},
{
    name: 'dataRate',
    short: 'r',
    type: 'number',
    description: 'Defines an dataRate(device(devicedata), application(latest))',
    example: "'script --dataRate=value' or 'script -s value'"
},
{
    name: 'dataFormat',
    short: 'f',
    type: 'string',
    description: 'Defines an dataFormat',
    example: "'script --dataFormat=value' or 'script -s value'"
},
{
    name: 'deviceName',
    short: 'd',
    type: 'string',
    description: 'Defines an deviceName (device, application)',
    example: "'script --service=value' or 'script -s value'"
},
{
    name: 'host',
    short: 'h',
    type: 'string',
    description: 'Defines an host (device, application)',
    example: "'script --service=value' or 'script -s value'"
},
{
    name: 'port',
    type: 'string',
    description: 'Defines an port (device, application)',
    example: "'script --service=value' or 'script -s value'"
},
{
    name: 'tele',
    type: 'csv,string',
    description: 'Defines an latest telemetry data (application)',
    example: "'script --tele=value'"
},
{
    name: 'attr',
    type: 'csv,string',
    description: 'Defines an latest attribute data (application)',
    example: "'script --attr=value'"
},
{
    name: 'set',
    type: 'csv,string',
    description: 'Defines an attribute post (application)',
    example: "'script --set=key=value,'"
},
{
    name: 'timer',
    short: 't',
    type: 'number',
    description: 'Defines an timer for process (device, application)',
    example: "'script --timer=value' or 'script -t value'"
}
]