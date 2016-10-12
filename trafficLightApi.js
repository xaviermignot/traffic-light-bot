"use strict";
const needle = require('needle');
const apiBaseUrl = process.env.API_URL;
(function (LightState) {
    LightState[LightState["On"] = 0] = "On";
    LightState[LightState["Off"] = 1] = "Off";
})(exports.LightState || (exports.LightState = {}));
var LightState = exports.LightState;
(function (LightColor) {
    LightColor[LightColor["Green"] = 0] = "Green";
    LightColor[LightColor["Amber"] = 1] = "Amber";
    LightColor[LightColor["Red"] = 2] = "Red";
})(exports.LightColor || (exports.LightColor = {}));
var LightColor = exports.LightColor;
;
(function (TrafficLightState) {
    TrafficLightState[TrafficLightState["Off"] = 0] = "Off";
    TrafficLightState[TrafficLightState["Green"] = 1] = "Green";
    TrafficLightState[TrafficLightState["Orange"] = 2] = "Orange";
    TrafficLightState[TrafficLightState["Red"] = 3] = "Red";
})(exports.TrafficLightState || (exports.TrafficLightState = {}));
var TrafficLightState = exports.TrafficLightState;
;
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
    return new Promise((resolve, reject) => needle.put(`${apiBaseUrl}/trafficlight/${state}`, (error, response) => {
        if (!error && response.statusCode == 200) {
            var body = response.body;
            var state = TrafficLightState[body];
            resolve(state);
        }
    }));
}
exports.set = set;
// export function get(): Promise<TrafficLight> {
//     return new Promise<TrafficLight>((resolve, reject) =>
//         needle.get(`${apiBaseUrl}/trafficlight`,
//             (error, response) => {
//                 if (!error && response.statusCode == 200) {
//                     var model = response.body;
//                     setLightsOn(model);
//                     resolve(model);
//                 }
//             }));
// }
// function setLightsOn(trafficLight: TrafficLight): void {
//     if (!trafficLight) {
//         return;
//     }
//     trafficLight.lightsOn = new Array<LightColor>();
//     var stateOn = LightState[LightState.On];
//     if (trafficLight.greenLightState.toString() == stateOn) {
//         trafficLight.lightsOn.push(LightColor.Green);
//     }
//     if (trafficLight.amberLightState.toString() == stateOn) {
//         trafficLight.lightsOn.push(LightColor.Amber);
//     }
//     if (trafficLight.redLightState.toString() == stateOn) {
//         trafficLight.lightsOn.push(LightColor.Red);
//     }
// } 
