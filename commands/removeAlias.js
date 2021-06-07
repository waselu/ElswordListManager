
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function removeAlias(message, args, trueArgs, client) {
    let list = saveManager.getList();

    async function classFound(message, index, realName) {
        let className = list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]['className'];
        
        async function aliasFound(message, index, realName) {
            await helper.sendBotMessage(message, 'You already have a character named "' + className + '", cannot remove alias');
        }

        async function aliasNotFound(message, realName) {
            list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]['alias'] = null;
        }

        async function userNotFoundAlias(message, realName) {
            await helper.sendBotMessage(message, 'You have no list yet');
        }

        await helper.doIfClassFoundInUserList(message, className, aliasFound, aliasNotFound, userNotFoundAlias);
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
	name: 'removealias',
    nbArgsMin: 1,
    nbArgsMax: 1,
    helpGroup: 'Characters',
	description: 'Remove an alias for one of your character',
    example: '``' + prefix + 'removealias bondour``',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await removeAlias(message, args, trueArgs, client);
	}
}