
const helper = require('../utils/listHelper');

async function show(message, args) {
    function userFound(message) {
        message.channel.send(helper.userListToServerList(message.author.username));
    }

    function userNotFound() {
        message.channel.send('You have no list yet');
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
}

module.exports = {
	name: 'show',
	description: 'Show your current list',
	execute(message, args) {
		show(message, args);
	}
}