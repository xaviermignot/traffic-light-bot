import * as api from "./trafficLightApi";

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