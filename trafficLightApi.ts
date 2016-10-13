import { getMessageFromState } from './messageHelper';
import needle = require('needle');

const apiBaseUrl = process.env.API_URL;

export enum TrafficLightState {
    Off,
    Green,
    Orange,
    Red
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
        needle.put(`${apiBaseUrl}/trafficlight/${TrafficLightState[state]}`,
            null,
            (error, response) => {
                if (!error && response.statusCode == 200) {
                    var body: string = response.body;
                    var state: TrafficLightState = TrafficLightState[body];
                    resolve(state);
                }
            }));
}