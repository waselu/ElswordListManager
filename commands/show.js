
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function show(message, args) {
    function handleFresh(attrValue, classDef) {
        if (attrValue) {
            return helper.findEmojiByAttributeName("fresh");
        }
        else if (!classDef["reset"]) {
            return helper.findEmojiByAttributeName("flamemark")
        }
        return null;
    }

    function handleStone(attrValue, classDef) {
        if (!attrValue) {
            return null;
        }
        return helper.findEmojiByAttributeName(attrValue);
    }

    let specListCases = {
        "fresh": handleFresh,
        "stone": handleStone
    };
    let listStr = "";

    async function userFound(message) {
        let charList = "";
        let userList = saveManager.getList()[message.author.username];
        userList = userList['lists'][userList['active']]['list'];
        for ([index, classDef] of userList.entries()) {
            charList += "\n" + classDef["emoji"];
            for (attribute in classDef) {
                attributeText = null;
                if (attribute in specListCases) {
                    attributeText = specListCases[attribute](classDef[attribute], classDef);
                }
                else if (classDef[attribute]) {
                    attributeText = helper.findEmojiByAttributeName(attribute);
                }
                if (attributeText) {
                    charList += " " + attributeText;
                }
            }
            charList += " " + (classDef['alias'] != null ? classDef['alias'] : classDef['className']);
        }
        listStr = "Your Character(s): " + charList + "\n";
        helper.copyList(message.author.username);
        listStr += "\nList:\n" + helper.userListToEmojiList(message.author.username) + "\n";
        await helper.sendBasicBotEmbed(message, message.author.username + '\'s list: ' + saveManager.getList()[message.author.username]['active'], listStr, '');
    }

    async function userNotFound(message) {
        await helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
}

module.exports = {
	name: 'show',
    argNumber: '0',
    helpGroup: 'List',
	description: 'Show the state of the selectionned list',
    example: '``' + prefix + 'show``',
    additionalInfo: '',
	async execute(message, args, client) {
		await show(message, args);
	}
}