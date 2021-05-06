
const { attributes } = require('../config.json');
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
        message.channel.send("You already added " + realName + " to your list");
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

    await message.channel.send(helper.userListToServerList(message.author.username))
    saveManager.setList(list);
}

module.exports = {
	name: 'add',
	description: 'Add a class to your list',
	execute(message, args) {
		add(message, args);
	}
}