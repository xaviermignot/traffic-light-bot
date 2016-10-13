"use strict";
const restify = require('restify');
const builder = require('botbuilder');
const dotenv = require('dotenv');
const api = require("./trafficLightApi");
const msgHelper = require("./messageHelper");
dotenv.config();
//=========================================================
// Bot Setup
//=========================================================
// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());
//=========================================================
// Bots Dialogs
//=========================================================
// Create bot and add dialogs
var recognizer = new builder.LuisRecognizer(process.env.LUIS_URL);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', intents);
intents.matches('SwitchOnBulb', '/switchOn')
    .matches('SwitchOffBulb', '/switchOff')
    .matches('GetLightsState', '/getState')
    .onDefault(builder.DialogAction.send('Désolé, je n\'ai pas compris la question :-/'));
bot.dialog('/switchOn', [
        (session, args, next) => {
        var colorEntity = builder.EntityRecognizer.findEntity(args.entities, 'color');
        if (!colorEntity) {
            builder.Prompts.choice(session, 'Quel feu je dois allumer ?', ['rouge', 'orange', 'vert'], { retryPrompt: 'Pardon, vous avez dit quel feu ?' });
        }
        else {
            next({ response: colorEntity, resumed: null });
        }
    },
        (session, result) => {
        var color = result.response.entity;
        if (color) {
            session.send(`Okay, j'allume le feu ${color}`);
            session.sendTyping();
            api.set(msgHelper.getStateFromIntentColor(color)).then((state) => {
                session.send(`C'est bon, le feu ${color} est allumé`);
            })
                .catch(() => {
                session.send(`Damned, je n'ai pas réussi à allumer le feu`);
            })
                .then(() => session.endDialog());
        }
    }
]);
bot.dialog('/getState', (session, args) => {
    api.get().then((state) => {
        session.send(msgHelper.getMessageFromState(state));
    })
        .catch(() => {
        session.send('Mince, je n\'arrive pas à joindre le feu :\'(');
    })
        .then(() => session.endDialog());
});
