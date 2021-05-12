
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function run(message, args) {
    let list = saveManager.getList();

    async function classFound(message, index, realName) {
        if (list[message.author.username][index]["fresh"] == 0) {
            await helper.sendBotMessage(message, "You have already run rosso on " + className);
            return;
        }

        list[message.author.username][index]["fresh"] = false;
    }

    async function classNotFound(message, realName) {
        await helper.sendBotMessage(message, realName + " was not fount in your list");
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, "You have no list yet");
    }

    for (className of args) {
        await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);
    }

    await helper.sendUserList(message, list);
}

module.exports = {
	name: 'run',
    argNumber: '>0',
	description: 'Run raid on one or many character',
    example: '``' + prefix + 'run NP``\n' +
        '``' + prefix + 'run CL Devi KE``',
    additionalInfo: 'this command has the same effect as setting "not fresh" on a character',
	async execute(message, args, client) {
		await run(message, args);
	}
}