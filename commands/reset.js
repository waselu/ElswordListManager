
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function reset(message, args) {
    list = saveManager.getList();

    async function userFound(message) {
        for ([index, whatever] of list[message.author.username].entries()) {
            list[message.author.username][index]["fresh"] = true;
        }
        await helper.sendUserList(message, list);
    }

    async function userNotFound(message) {
       await helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
}

module.exports = {
	name: 'reset',
    argNumber: '0',
	description: 'Shortcut for calling ``' + prefix + 'set [CharacterName] fresh`` on every character',
    example: '``' + prefix + 'weeklyreset``',
    additionalInfo: '',
	async execute(message, args, client) {
		await reset(message, args);
	}
}