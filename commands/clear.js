const saveManager = require('../utils/saveManager');

async function clear(message, args, client) {
    saveManager.setList({});
}

module.exports = {
	name: 'clear',
    argNumber: '0',
	helpGroup: 'Debug',
	description: '',
    example: '',
    additionalInfo: '',
	async execute(message, args, client) {
		await clear(message, args, client);
	}
}