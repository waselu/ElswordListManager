
const { prefix } = require('../config.json');
const helper = require('../utils/listHelper');

async function show(message, args) {
    function userFound(message) {
        helper.sendUserList(message);
    }

    function userNotFound() {
        helper.sendBotMessage(message, 'You have no list yet');
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
}

module.exports = {
	name: 'show',
    argNumber: '0',
	description: 'Show your current list',
    example: '``' + prefix + 'list``',
    additionalInfo: '',
	execute(message, args, client) {
		show(message, args);
	}
}