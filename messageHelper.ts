import { LightColor } from './trafficLightApi';
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

export function getMessageFromModel(model: api.TrafficLight): string {
    if (!model || !model.lightsOn) {
        return 'Je n\'arrive pas à voir le feu :\'(';
    }

    switch (model.lightsOn.length) {
        case 0:
            return "Tous les feux sont éteins";
        case 1:
            return `Le feu est ${getColorName(model.lightsOn[0])}`;
        case 2:
            return `Les feux ${getColorName(model.lightsOn[0])} et ${getColorName(model.lightsOn[1])} sont allumés`;
        default:
            return 'Tous les feux sont allumés';
    }
}

function getColorName(lightColor: api.LightColor) {
    switch (lightColor) {
        case api.LightColor.Green:
            return "vert";
        case api.LightColor.Amber:
            return "orange";
        case api.LightColor.Red:
            return "rouge";
    }
}