
const { prefix, attributes } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function alias(message, args, client) {
    console.log(args);
    let list = saveManager.getList();

    async function classFound(message, index, realName) {
        list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]['alias'] = args[1];
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
	async execute(message, args, client) {
		await alias(message, args, client);
	}
}