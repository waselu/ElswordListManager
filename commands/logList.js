const saveManager = require('../utils/saveManager');

async function logList(message, args, client) {
    if (args.length > 0) {
        for (arg of args) {
            console.log(saveManager.getList()[message.author.username]['lists'][arg]['list']);
        }
    } else {
        console.log(saveManager.getList()[message.author.username]);
    }
}

module.exports = {
	name: 'loglist',
    helpGroup: 'Debug',
	description: '',
    example: '',
    additionalInfo: '',
	async execute(message, args, client) {
		await logList(message, args, client);
	}
}