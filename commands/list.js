
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function list(message, args) {
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
        let userList = JSON.parse(JSON.stringify(saveManager.getList()[message.author.username]));
        userList.sort(function(elem1, elem2) { 
            elem1Index = helper.findElswordClass(elem1["className"])["index"];
            elem2Index = helper.findElswordClass(elem2["className"])["index"];

            if (elem1Index < elem2Index) {
                return -1;
            }
            if (elem1Index < elem2Index) {
                return 1;
            }
            return 0;
        })
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
    }

    function userNotFound(message) {
        helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
    listStr += "\nList:\n" + helper.userListToServerList(message.author.username) + "\n";
    helper.sendBasicBotEmbed(message, message.author.username, listStr, '');
}

module.exports = {
	name: 'list',
    argNumber: '0',
	description: 'Show your current characters + attributes and list',
    example: '``' + prefix + 'list``',
    additionalInfo: 'Unlike the show command, list allows you to see every character and their attributes',
	execute(message, args, client) {
		list(message, args);
	}
}