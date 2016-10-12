import restify = require('restify');
import builder = require('botbuilder');

import * as api from "./trafficLightApi";
import * as msgHelper from "./messageHelper";

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
bot.dialog('/', [
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send(`Bonjour ${session.userData.name} !`);

        api.get().then((state) => {
            session.send(msgHelper.getMessageFromState(state));
        })
        .catch(() => {
            session.send('Mince, je n\'arrive pas à joindre le feu :\'(');
        });
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