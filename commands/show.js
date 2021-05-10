
const helper = require('../utils/listHelper');

async function show(message, args) {
    function userFound(message) {
        helper.sendBotMessage(message, helper.userListToServerList(message.author.username));
    }

    function userNotFound() {
        helper.sendBotMessage(message, 'You have no list yet');
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
    helper.copyList(message.author.username);
}

module.exports = {
	name: 'show',
    argNumber: '0',
	description: 'Show your current list',
	execute(message, args, client) {
		show(message, args);
	}
}