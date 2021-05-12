
const { attributes, prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function add(message, args, ignoreMessage) {
    let attributesArray = {};
    let list = saveManager.getList();

    for ([index, attributeDef] of attributes.entries()) {
        if (attributeDef["isDefault"]) {
            attributesArray[attributeDef["name"]] = attributeDef["value"];
        }
    }

    async function classFound(message, index, realName) {
        await helper.sendBotMessage(message, "You already added " + realName + " to your list");
    }
    
    async function classNotFound(message, realName) {
        list[message.author.username].push({...{"className": realName, "emoji": helper.findEmojiByClassName(realName)}, ...attributesArray});
    }

    async function userNotFound(message, realName) {
        list[message.author.username] = [{...{"className": realName, "emoji": helper.findEmojiByClassName(realName)}, ...attributesArray}];
    }

    for (className of args) {
        await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound, true)
    }

    if (!ignoreMessage) {
        await helper.sendUserList(message, list);
    }
}

module.exports = {
	name: 'add',
    argNumber: '>0',
	description: 'Add one or many class(es) to your list',
    example: '``' + prefix + 'add CL NP``\n``' + prefix + 'add elsword1 laby3 ara2``',
    additionalInfo: 'You can refer to classes by either their acronym, full class name or character + class number (KE, KnightEmperor, Elsword1)',
	async execute(message, args, client, ignoreMessage = false) {
		await add(message, args, ignoreMessage);
	}
}