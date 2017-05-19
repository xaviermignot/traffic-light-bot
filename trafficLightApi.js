"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const needle = require("needle");
const apiBaseUrl = process.env.API_URL;
var TrafficLightState;
(function (TrafficLightState) {
    TrafficLightState[TrafficLightState["Off"] = 0] = "Off";
    TrafficLightState[TrafficLightState["Green"] = 1] = "Green";
    TrafficLightState[TrafficLightState["Orange"] = 2] = "Orange";
    TrafficLightState[TrafficLightState["Red"] = 3] = "Red";
    TrafficLightState[TrafficLightState["Broken"] = 4] = "Broken";
})(TrafficLightState = exports.TrafficLightState || (exports.TrafficLightState = {}));
function get() {
    return new Promise((resolve, reject) => needle.get(`${apiBaseUrl}/trafficlight`, (error, response) => handleResponse(error, response, resolve, reject, (res) => {
        var body = response.body;
        return TrafficLightState[body];
    })));
}
exports.get = get;
function set(state) {
    return new Promise((resolve, reject) => needle.put(`${apiBaseUrl}/trafficlight/${TrafficLightState[state]}`, null, (error, response) => handleResponse(error, response, resolve, reject)));
}
exports.set = set;
function switchOff() {
    return new Promise((resolve, reject) => needle.delete(`${apiBaseUrl}/trafficlight`, null, (error, response) => handleResponse(error, response, resolve, reject)));
}
exports.switchOff = switchOff;
function handleResponse(error, response, resolve, reject, parseResult) {
    if (!error && response.statusCode == 200) {
        var result = parseResult != null ? parseResult(response) : undefined;
        resolve(result);
    }
    else {
        reject();
    }
}
