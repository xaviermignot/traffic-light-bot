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
bot.dialog('/welcome', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        }
        else {
            next();
        }
    },
    function (session, results) {
        builder.Prompts.text(session, `Bonjour ${session.userData.name}, que puis-je faire pour vous ?`);
        session.endDialog();
    }
]);
bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Bonjour ! Quel est votre nom ?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);
var recognizer = new builder.LuisRecognizer(process.env.LUIS_URL);
var intents = new builder.IntentDialog({ recognizers: [recognizer] });
intents.onBegin((session, args, next) => {
    session.beginDialog('/welcome');
});
bot.dialog('/', intents);
intents.matches('SwitchOnBulb', [
        (session, args) => {
        var color = builder.EntityRecognizer.findEntity(args.entities, 'color');
        if (!color) {
            builder.Prompts.text(session, 'Quel feu je dois allumer ?');
        }
        else {
            session.send(`Okay, j'allume le feu ${color.entity}`);
            session.sendTyping();
            api.set(msgHelper.getStateFromIntentColor(color.entity)).then((state) => {
                session.send(`C'est bon, le feu ${color.entity} est allumé`);
            })
                .catch(() => {
                session.send(`Damned, je n'ai pas réussi à allumer le feu`);
            })
                .then(() => session.endDialog());
        }
    }
]);
intents.matches('GetLightsState', [
        (session, args) => {
        api.get().then((state) => {
            session.send(msgHelper.getMessageFromState(state));
        })
            .catch(() => {
            session.send('Mince, je n\'arrive pas à joindre le feu :\'(');
        });
    }
]);
intents.matches('None', [
        (session, args) => {
        session.send('Désolé, je n\'ai pas compris la question :-/');
    }
]);
