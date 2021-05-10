
const { attributes, prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function add(message, args) {
    let attributesArray = {};
    let list = saveManager.getList();

    for ([index, attributeDef] of attributes.entries()) {
        if (attributeDef["isDefault"]) {
            attributesArray[attributeDef["name"]] = attributeDef["value"];
        }
    }

    async function classFound(message, index, realName) {
        helper.sendBotMessage(message, "You already added " + realName + " to your list");
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

    helper.sendBotMessage(message, helper.userListToServerList(message.author.username))
    helper.copyList(message.author.username);
    saveManager.setList(list);
}

module.exports = {
	name: 'add',
    argNumber: '>0',
	description: 'Add one or many class(es) to your list',
    example: '``' + prefix + 'add CL NP``\n``' + prefix + 'add elsword1 laby3 ara2``',
    additionalInfo: 'You can refer to classes by either their acronym or character + class number',
	execute(message, args, client) {
		add(message, args);
	}
}