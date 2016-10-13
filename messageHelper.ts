import * as api from "./trafficLightApi";

export function getMessageFromState(state: api.TrafficLightState): string {
    switch (state) {
        case api.TrafficLightState.Off:
            return 'Le feu est éteint';
        case api.TrafficLightState.Green:
            return 'Le feu est vert';
        case api.TrafficLightState.Orange:
            return 'Le feu est orange';
        case api.TrafficLightState.Red:
            return 'Le feu est rouge';
    }
}

export function getStateFromIntentColor(color: string): api.TrafficLightState {
    switch (color) {
        case 'rouge':
            return api.TrafficLightState.Red;
        case 'orange':
            return api.TrafficLightState.Orange;
        case 'vert':
            return api.TrafficLightState.Green;
        default:
            return api.TrafficLightState.Off;
    }
}