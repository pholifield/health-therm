// (c) 2015 Don Coleman
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/* global ble, statusDiv, beatsPerMinute */
/* jshint browser: true , devel: true*/

// See BLE heart rate service http://goo.gl/wKH3X7
var healthThermometer = {
    service: '1809'
    measurement: '2a1c'
};

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.scan();
    },
    scan: function() {
        app.status("Scanning for Health Thermometer");

        var foundHealthThermometer = false;

        function onScan(peripheral) {
            // this is demo code, assume there is only one heart rate monitor
            console.log("Found " + JSON.stringify(peripheral));
			$("statusDiv").append(device.name); $("statusDiv").append(device.id); $("statusDiv").append(device.rssi);
            foundHealthThermometer = true;

            // ble.connect(peripheral.id, app.onConnect, app.onDisconnect);
        }

        function scanFailure(reason) {
            $("statusDiv").append("Scan failed");
        }

        ble.scan([healthThermometer.service], 5, onScan, scanFailure);

        setTimeout(function() {
            if (!foundHealthThermometer) {
                app.status("Did not find a health thermometer.");
            }
        }, 5000);
    },
    onConnect: function(peripheral) {
        app.status("Connected to " + peripheral.id);
        // ble.startNotification(peripheral.id, healthThermometer.service, healthThermometer.measurement, app.onData, app.onError);
    },
    onDisconnect: function(reason) {
        alert("Disconnected " + reason);
        beatsPerMinute.innerHTML = "...";
        app.status("Disconnected");
    },
    onData: function(buffer) {
        // assuming heart rate measurement is Uint8 format, real code should check the flags
        // See the characteristic specs http://goo.gl/N7S5ZS
        var data = new Uint8Array(buffer);
        beatsPerMinute.innerHTML = data[1];
    },
    onError: function(reason) {
        alert("There was an error " + reason);
    },
    status: function(message) {
        console.log(message);
        statusDiv.innerHTML = message;
    }
};

app.initialize();
