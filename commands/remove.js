
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function remove(message, args) {
    let list = saveManager.getList();

    async function successfullDelete(message, index, realName) {
        list[message.author.username]['lists'][list[message.author.username]['active']]['list'].splice(index, 1);
    }

    async function failureDelete(message, realName) {
        await helper.sendBotMessage(message, realName + " was not fount in your list")
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, "You have no list yet")
    }

    for (className of args) {
        await helper.doIfClassFoundInUserList(message, className, successfullDelete, failureDelete, userNotFound)
    }

    await helper.sendUserList(message, list);
}

module.exports = {
	name: 'remove',
    argNumber: '>0',
    helpGroup: 'Characters',
	description: 'Remove one or many character(s) from your list',
    example: '``' + prefix + 'remove CL NP``\n``' + prefix + 'remove elsword1 laby3 ara2``\n``' + prefix + 'remove myAliasA myAliasB``',
    additionalInfo: 'You must follow the add syntax, or use aliases if you set any',
	async execute(message, args, client) {
		await remove(message, args);
	}
}