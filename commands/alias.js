
const { prefix, attributes } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function alias(message, args, trueArgs, client) {
    let list = saveManager.getList();

    async function classFound(message, index, realName) {
        async function aliasFound(message, index, realName) {
            await helper.sendBotMessage(message, 'You already have a character named "' + trueArgs[1] + '"');
        }

        async function aliasNotFound(message, realName) {
            list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]['alias'] = trueArgs[1];
        }

        async function userNotFoundAlias(message, realName) {
            await helper.sendBotMessage(message, 'You have no list yet');
        }

        await helper.doIfClassFoundInUserList(message, args[1], aliasFound, aliasNotFound, userNotFoundAlias);
    }
    
    async function classNotFound(message, realName) {
        await helper.sendBotMessage(message, realName + " was not found in your list");
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, 'You have no list yet');
    }

    await helper.doIfClassFoundInUserList(message, args[0], classFound, classNotFound, userNotFound)

    helper.sendUserList(message, list, client);
}

module.exports = {
	name: 'alias',
    nbArgsMin: 2,
    nbArgsMax: 2,
    helpGroup: 'Characters',
	description: 'Set an alias for one of your character, allowing you to add another one of the same class',
    example: '``' + prefix + 'alias RM bondour``',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await alias(message, args, trueArgs, client);
	}
}