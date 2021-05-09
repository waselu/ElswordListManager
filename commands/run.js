
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function run(message, args) {
    let list = saveManager.getList();

    async function classFound(message, index, realName) {
        if (list[message.author.username][index]["fresh"] == 0) {
            helper.sendBotMessage(message, "You have already run rosso on " + className);
            return;
        }

        list[message.author.username][index]["fresh"] = false;
    }

    async function classNotFound(message, realName) {
        helper.sendBotMessage(message, realName + " was not fount in your list");
    }

    async function userNotFound(message, realName) {
        helper.sendBotMessage(message, "You have no list yet");
    }

    for (className of args) {
        await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);
    }

    await helper.sendBotMessage(message, helper.userListToServerList(message.author.username));
    helper.copyList(message.author.username);
    saveManager.setList(list);
}

module.exports = {
	name: 'run',
	description: 'Run raid on a certain character',
	execute(message, args, client) {
		run(message, args);
	}
}