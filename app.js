"use strict";
const restify = require('restify');
const builder = require('botbuilder');
const dotenv = require('dotenv');
// Use the .env file for managing environment variable for local development
dotenv.config();
const api = require("./trafficLightApi");
const msgHelper = require("./messageHelper");
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
// Makes the connexion between the LUIS intents and the bot dialogs
intents.matches('SwitchOnBulb', '/switchOn')
    .matches('SwitchOffBulb', '/switchOff')
    .matches('GetLightsState', '/getState')
    .matches('SayHi', '/sayHi')
    .onDefault('/fallback');
// Dialog used for switching a light on
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
            api.set(msgHelper.getStateFromIntentColor(color))
                .then(() => session.send(`C'est bon, le feu ${color} est allumé`))
                .catch(() => session.send(`Damned, je n'ai pas réussi à allumer le feu ${color}`))
                .then(() => session.endDialog());
        }
    }
]);
// Dialog used to switch the lights off
bot.dialog('/switchOff', (session, args) => {
    session.send('Okay, j\'éteins le feu');
    session.sendTyping();
    api.switchOff()
        .then(() => session.send(['C\'est fait', 'Et voilà', 'A votre service !']))
        .catch(() => session.send('Oups je trouve pas le bouton :-/'))
        .then(() => session.endDialog());
});
// Dialog used to tell the user which light is on (if there is one)
bot.dialog('/getState', (session, args) => {
    api.get()
        .then((state) => session.send(msgHelper.getMessageFromState(state)))
        .catch(() => session.send('Mince, je n\'arrive pas à joindre le feu :\'('))
        .then(() => session.endDialog());
});
bot.dialog('/sayHi', (session) => {
    session.sendTyping();
    session.send(['Bonjour !', 'Hello !', 'Salutations !']);
    session.send(['Qu\'est ce que je peux faire pour vous ajourd\'hui ?', 'Je peux vous aider ?', 'Que puis-je faire pour vous ?']);
    session.endDialog();
});
// Fallback dialog triggered if the bot can't understand the user input
bot.dialog('/fallback', (session, args) => {
    session.send(`Désolé, je n'ai pas compris la question :-/\n\n
Je suis un bot qui peut contrôler un feu de circulation, et pis c'est tout.\n
Voici ce que je suis capable de faire (pour le moment):\n
- allumer un feu\n
- éteindre le feu\n
- dire quel feu est allumé\n`);
    session.endDialog();
});
