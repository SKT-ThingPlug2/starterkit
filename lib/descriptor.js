module.exports = {
    "airconditioner" : {
        "version": "0.1",
        "deviceDescriptorName": "starterkitairconditioner",
        "title": "airconditioner",
        "description": "starterkit airconditioner",
        "deviceInfo": {
            "memory": 100,
            "model": "airconditioner",
            "manufacturer": "SKT",
            "type": "device"
        },
        "deviceData": {
            "format": "json",
            "attributes": [
                {
                    "name": "airconditioner",
                    "commandable": true
                }
            ],
            "telemetries": [
                {
                    "name": "temperature"
                }
            ]
        }
    },
    "dehumidifier" : {
        "version": "0.1",
        "deviceDescriptorName": "starterkitdehumidifier",
        "title": "dehumidifier",
        "description": "starterkit dehumidifier",
        "deviceInfo": {
            "memory": 100,
            "model": "dehumidifier",
            "manufacturer": "SKT",
            "type": "device"
        },
        "deviceData": {
            "format": "json",
            "attributes": [
                {
                    "name": "dehumidifier",
                    "commandable": true
                }
            ],
            "telemetries": [
                {
                    "name": "humidity"
                }
            ]
        }
    },
    "gps" : {
        "version": "0.1",
        "deviceDescriptorName": "starterkitgps",
        "title": "gps",
        "description": "starterkit gps",
        "deviceInfo": {
            "memory": 100,
            "model": "gps",
            "manufacturer": "SKT",
            "type": "device"
        },
        "deviceData": {
            "format": "json",
            "attributes": [
                {
                    "name": "gps",
                    "commandable": true
                }
            ],
            "telemetries": [
                {
                    "name": "latitude"
                },
                {
                    "name": "longitude"
                }
            ]
        }
    },
    "logistics" : {
        "version": "0.1",
        "deviceDescriptorName": "starterkitlogistics",
        "title": "logistics",
        "description": "starterkit logistics",
        "deviceInfo": {
            "memory": 100,
            "model": "logistics",
            "manufacturer": "SKT",
            "type": "device"
        },
        "deviceData": {
            "format": "json",
            "attributes": [
            ],
            "telemetries": [
                {
                "name": "infrared"
                }
            ]
        }
    },   
    "barricade" : {
        "version": "0.1",
        "deviceDescriptorName": "starterkitbarricade",
        "title": "barricade",
        "description": "starterkit barricade",
        "deviceInfo": {
            "memory": 100,
            "model": "barricade",
            "manufacturer": "SKT",
            "type": "device"
        },
        "deviceData": {
            "format": "json",
            "attributes": [
                {
                    "name": "barricade",
                    "commandable": true
                }
            ],
            "telemetries": [
                {
                    "name": "barricade"
                }
            ]
        }
    },
    "default" : {
        "version": "0.1",
        "deviceDescriptorName": "StarterKitDescriptor",
        "title": "StarterKitDescriptor",
        "description": "StarterKitDescriptor",
        "deviceInfo": {
            "memory": 100,
            "model": "StarterKit",
            "manufacturer": "SKT",
            "type": "device"
        },
        "deviceData": {
            "format": "json",
            "attributes": [
            ],
            "telemetries": [
            ]
        }
    }
}