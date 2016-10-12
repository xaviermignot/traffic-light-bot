import { getMessageFromState } from './messageHelper';
import needle = require('needle');

const apiBaseUrl = process.env.API_URL;

export enum LightState {
    On,
    Off
}

export enum LightColor {
    Green,
    Amber,
    Red
};

export enum TrafficLightState {
    Off,
    Green,
    Orange,
    Red
};

export interface TrafficLight {
    greenLightState: LightState;
    amberLightState: LightState;
    redLightState: LightState;
    lightsOn: Array<LightColor>;
}

export function get(): Promise<TrafficLightState> {
    return new Promise<TrafficLightState>((resolve, reject) =>
        needle.get(`${apiBaseUrl}/trafficlight`,
            (error, response) => {
                if (!error && response.statusCode == 200) {
                    var body: string = response.body;
                    var state: TrafficLightState = TrafficLightState[body];
                    resolve(state);
                }
            }));
}

export function set(state: TrafficLightState): Promise<TrafficLightState> {
    return new Promise<TrafficLightState>((resolve, reject) =>
        needle.put(`${apiBaseUrl}/trafficlight/${state}`,
            (error, response) => {
                if (!error && response.statusCode == 200) {
                    var body: string = response.body;
                    var state: TrafficLightState = TrafficLightState[body];
                    resolve(state);
                }
            }));
}

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