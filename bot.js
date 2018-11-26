"use strict";

let Discord = require(`discord.js`)
    , BotHelper = require(`./helper`).BotHelper
    , config = require(`./config`)
    , bot = new Discord.Client()
;

bot.on(`ready`, () => {
    console.info('Bot has started');

    BotHelper.instance().updateStatus(bot);
});

bot.on(`message`, message => {
    if (message.author.bot) {
        return; // ignore messages from bots
    }
    if (!message.content) {
        return; // maybe will be useful
    }
    if (message.content[0] !== config.commandPrefix) {
        return; // ignore not command messages
    }

    let commandName = null
        , params = []
    ;
    if (message.content[1] !== config.commandPrefix) {
        commandName = `account_info`;
        params = message.content.substr(1).split(` `);
    } else {
        let parts = message.content.substr(2).split(` `);
        commandName = parts[0];
        params = parts.splice(1);
    }

    BotHelper.instance().handleCommand(commandName, params, message);
});

bot.login(config.botToken);
