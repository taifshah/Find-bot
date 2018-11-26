let instance = null
    , sprintf = require(`sprintf-js`).sprintf
    , moment = require(`moment`)
    , config = require(`./config`)
    , messages = require(`./messages`)
    , Adapter = require(`./adapter`).Adapter
    , Tool = require(`./tool`).Tool
;

class BotHelper {
    constructor() {
    }

    static instance() {
        if (null === instance) {
            instance = new BotHelper();
        }

        return instance;
    }

    updateStatus(bot) {
        bot.user.setActivity(`Say ??help`, { type: `WATCHING` });
    }

    handleCommand(command, params, message) {
        switch (command) {
            case `help`:
            case `info`:
                this.handleHelpCommand(message);
                break;
            case `account_info`:
                this.handleAccountInfoCommand(params, message);
                break;
            default:
                console.info(sprintf(`Unsupported "%s" command received.`, command));
        }
    }

    handleHelpCommand(message) {
        message.channel.send(sprintf(messages.info, message.author.id, config.commandPrefix))
    }

    handleAccountInfoCommand(params, message) {
        if (params.length < 1) {
            console.error(`Don't receive account username...`);

            return;
        }

        Adapter.instance().processAccountDetails(
            params[0],
            (account, gp) => {
                message.channel.send(sprintf(
                    messages.accountInfo,
                    message.author.id,
                    account.name,
                    Tool.calculateAccountReputation(account),
                    Tool.calculateAccountFullPower(account, gp),
                    Tool.calculateAccountOwnPower(account, gp),
                    Tool.calculateAccountReceivedPower(account, gp),
                    Tool.calculateAccountDelegatedPower(account, gp),
                    Tool.calculateAccountVotingPower(account),
                    account.last_vote_time,
                    Tool.formatBalance(account.balance),
                    Tool.formatBalance(account.sbd_balance),
                    moment(account.created).fromNow(true)
                ))
            },
            () => {
                message.channel.send(sprintf(messages.accountNotFound, message.author.id))
            }
        );
    }
}

module.exports.BotHelper = BotHelper;
