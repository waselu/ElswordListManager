const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function changeList(message, args, client) {
    list = saveManager.getList();

    async function userFound() {
        if (args[0] in list[message.author.id]['lists']) {
            list[message.author.id]['active'] = args[0];
        } else {
            await helper.sendBotMessage(message, 'You have no list named ' + args[0]);
            return;
        }
    
        await helper.sendUserList(message, list, true, client);
    }

    async function userNotFound() {
        await helper.sendBotMessage(message, 'You have no list yet');
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
}

module.exports = {
	name: 'changelist',
    nbArgsMin: 1,
    nbArgsMax: 1,
    helpGroup: 'List',
	description: 'Swap to one of your other lists',
    example: '``' + prefix + 'changelist myRossoList``',
    additionalInfo: '',
	async execute(message, args, client) {
		await changeList(message, args, client);
	}
}