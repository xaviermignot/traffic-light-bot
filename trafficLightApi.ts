import needle = require('needle');

const apiBaseUrl = process.env.API_URL;

export enum TrafficLightState {
    Off,
    Green,
    Orange,
    Red,
    Broken
}

export function get(): Promise<TrafficLightState> {
    return new Promise<TrafficLightState>((resolve, reject) =>
        needle.get(`${apiBaseUrl}/trafficlight`,
            (error: Error, response: { body: string; }) =>
                handleResponse(error, response, resolve, reject,
                    () => {
                        var body: string = response.body;
                        return TrafficLightState[body];
                    })
        ));
}

export function set(state: TrafficLightState): Promise<void> {
    return new Promise<void>((resolve, reject) =>
        needle.put(`${apiBaseUrl}/trafficlight/${TrafficLightState[state]}`,
            null,
            (error: Error, response: any) => handleResponse(error, response, resolve, reject)
        ));
}

export function switchOff(): Promise<void> {
    return new Promise<void>((resolve, reject) =>
        needle.delete(`${apiBaseUrl}/trafficlight`,
            null,
            (error: Error, response: any) => handleResponse(error, response, resolve, reject)
        ));
}

interface Func<T, TResult> { (item: T): TResult }

function handleResponse(error: Error, response: any, resolve: Function, reject: Function, parseResult?: Func<any, TrafficLightState>) {
    if (!error && response.statusCode == 200) {
        var result = parseResult != null ? parseResult(response) : undefined;
        resolve(result);
    } else {
        reject();
    }
}