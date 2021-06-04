const helper = require('../utils/listHelper');

async function getUserId(message, args, client) {
    let usertag = args.join(' ');

    let user = client.users.cache.find(function(user) {
        return user.username.toLowerCase() + '#' + user.discriminator == usertag;
    });

    if (!user) {
        helper.sendBotMessage(message, 'No user named "' + usertag + '" is connected');
        return;
    }

    helper.sendBotMessage(message, user.id);
}

module.exports = {
	name: 'getuserid',
    helpGroup: 'Debug',
    nbArgsMin: 1,
	description: '',
    example: '',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await getUserId(message, args, client);
	}
}