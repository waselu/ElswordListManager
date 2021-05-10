
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function weeklyreset(message, args) {
    list = saveManager.getList();

    async function userFound(message) {
        for ([index, whatever] of list[message.author.username].entries()) {
            list[message.author.username][index]["fresh"] = true;
        }
        helper.sendBotMessage(message, helper.userListToServerList(message.author.username));
    }

    async function userNotFound(message) {
        helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
    helper.copyList(message.author.username);
    saveManager.setList(list);
}

module.exports = {
	name: 'weeklyreset',
    argNumber: '0',
	description: 'Same effect as in-game weekly reset',
	execute(message, args, client) {
		weeklyreset(message, args);
	}
}