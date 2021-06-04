
const { prefix, attributes } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function add(message, args, client) {
    let list = saveManager.getList();

    async function classFound(message, index, realName) {
        await helper.sendBotMessage(message, "You already added " + realName + " to this list");
    }
    
    async function classNotFound(message, realName) {
        let attributesArray = {};

        for ([index, attributeDef] of attributes.entries()) {
            if (attributeDef["isDefault"].includes(list[message.author.id]['lists'][list[message.author.id]['active']]['type'])) {
                attributesArray[attributeDef["name"]] = attributeDef["value"];
            }
        }

        list[message.author.id]['lists'][list[message.author.id]['active']]['list'].push({...{"className": realName, "emoji": helper.findEmojiByClassName(realName)}, ...attributesArray});
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, 'You have no list yet');
    }

    for ([index, arg] of args.entries()) {
        await helper.doIfClassFoundInUserList(message, arg, classFound, classNotFound, userNotFound, true)
    }

    helper.sendUserList(message, list, client);
}

module.exports = {
	name: 'add',
    nbArgsMin: 1,
    helpGroup: 'Characters',
	description: 'Add characters to your list',
    example: '``' + prefix + 'add Devi CL RaS``',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await add(message, args, client);
	}
}