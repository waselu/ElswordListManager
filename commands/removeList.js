const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function removeList(message, args, client) {
    list = saveManager.getList();

    async function userFound() {
        if (args[0] in list[message.author.id]['lists']) {
            delete list[message.author.id]['lists'][args[0]];
            await helper.sendBotMessage(message, 'Successfully removed ' + args[0] + ' list');
            if (Object.keys(list[message.author.id]['lists']).length == 0) {
                delete list[message.author.id];
                await helper.sendBotMessage(message, 'You deleted your last list');
            } else {
                if (list[message.author.id]['active'] == args[0]) {
                    list[message.author.id]['active'] = Object.keys(list[message.author.id]['lists'])[0];
                    await helper.sendBotMessage(message, 'You deleted your active list, swapped to ' + list[message.author.id]['active'] + ' list');
                }
            }
        } else {
            await helper.sendBotMessage(message, 'You have no list named ' + args[0]);
            return;
        }
    
        saveManager.setList(list);
    }

    async function userNotFound() {
        await helper.sendBotMessage(message, 'You have no list yet');
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
}

module.exports = {
	name: 'removelist',
    nbArgsMin: 1,
    nbArgsMax: 1,
    helpGroup: 'List',
	description: 'Remove one of your lists',
    example: '``' + prefix + 'removelist myRossoList``',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await removeList(message, args, client);
	}
}