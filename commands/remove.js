
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function remove(message, args) {
    let list = saveManager.getList();

    async function successfullDelete(message, index, realName) {
        list[message.author.username].splice(index, 1);
    }

    async function failureDelete(message, realName) {
        message.channel.send(realName + " was not fount in your list")
    }

    async function userNotFound(message, realName) {
        message.channel.send("You have no list yet")
    }

    for (className of args) {
        await helper.doIfClassFoundInUserList(message, className, successfullDelete, failureDelete, userNotFound)
    }

    message.channel.send(helper.userListToServerList(message.author.username))
    helper.copyList(message.author.username);
    saveManager.setList(list);
}

module.exports = {
	name: 'remove',
	description: 'Remove a class from your list',
	execute(message, args, client) {
		remove(message, args);
	}
}