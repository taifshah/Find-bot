let instance = null
    , sprintf = require(`sprintf-js`).sprintf
    , moment = require(`moment`)
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

    handleAccountInfoCommand(username, params, message) {
        Adapter.instance().processAccountDetails(
            username,
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
