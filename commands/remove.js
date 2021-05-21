
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function remove(message, args, client) {
    let list = saveManager.getList();

    async function successfullDelete(message, index, realName) {
        list[message.author.id]['lists'][list[message.author.id]['active']]['list'].splice(index, 1);
    }

    async function failureDelete(message, realName) {
        await helper.sendBotMessage(message, realName + " was not found in your list")
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, "You have no list yet")
    }

    for (className of args) {
        await helper.doIfClassFoundInUserList(message, className, successfullDelete, failureDelete, userNotFound)
    }

    await helper.sendUserList(message, list, true, client);
}

module.exports = {
	name: 'remove',
    nbArgsMin: 1,
    helpGroup: 'Characters',
	description: 'Remove one or many character(s) from your list',
    example: '``' + prefix + 'remove CL NP``\n``' + prefix + 'remove elsword1 laby3 ara2``\n``' + prefix + 'remove myAliasA myAliasB``',
    additionalInfo: 'You must follow the add syntax, or use aliases if you set any',
	async execute(message, args, client) {
		await remove(message, args, client);
	}
}