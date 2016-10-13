"use strict";
const needle = require('needle');
const apiBaseUrl = process.env.API_URL;
(function (TrafficLightState) {
    TrafficLightState[TrafficLightState["Off"] = 0] = "Off";
    TrafficLightState[TrafficLightState["Green"] = 1] = "Green";
    TrafficLightState[TrafficLightState["Orange"] = 2] = "Orange";
    TrafficLightState[TrafficLightState["Red"] = 3] = "Red";
})(exports.TrafficLightState || (exports.TrafficLightState = {}));
var TrafficLightState = exports.TrafficLightState;
function get() {
    return new Promise((resolve, reject) => needle.get(`${apiBaseUrl}/trafficlight`, (error, response) => {
        if (!error && response.statusCode == 200) {
            var body = response.body;
            var state = TrafficLightState[body];
            resolve(state);
        }
    }));
}
exports.get = get;
function set(state) {
    return new Promise((resolve, reject) => needle.put(`${apiBaseUrl}/trafficlight/${TrafficLightState[state]}`, null, (error, response) => {
        if (!error && response.statusCode == 200) {
            var body = response.body;
            var state = TrafficLightState[body];
            resolve(state);
        }
    }));
}
exports.set = set;
