
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function weeklyreset(message, args) {
    list = saveManager.getList();

    async function userFound(message) {
        for ([index, whatever] of list[message.author.username].entries()) {
            list[message.author.username][index]["fresh"] = true;
        }
        helper.sendUserList(message, list);
    }

    async function userNotFound(message) {
        helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
}

module.exports = {
	name: 'weeklyreset',
    argNumber: '0',
	description: 'Shortcut for calling ``' + prefix + 'set [CharacterName] fresh`` on every character',
    examples: '``' + prefix + 'weeklyreset``',
    additionalInfo: '',
	execute(message, args, client) {
		weeklyreset(message, args);
	}
}