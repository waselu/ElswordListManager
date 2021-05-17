const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function removeList(message, args, client) {
    list = saveManager.getList();

    async function userFound() {
        if (args[0] in list[message.author.username]['lists']) {
            delete list[message.author.username]['lists'][args[0]];
            await helper.sendBotMessage(message, 'Successfully removed ' + args[0] + ' list');
            if (Object.keys(list[message.author.username]['lists']).length == 0) {
                delete list[message.author.username];
                await helper.sendBotMessage(message, 'You deleted your last list');
            } else {
                if (list[message.author.username]['active'] == args[0]) {
                    list[message.author.username]['active'] = Object.keys(list[message.author.username]['lists'])[0];
                    await helper.sendBotMessage(message, 'You deleted your active list, swapped to ' + list[message.author.username]['active'] + ' list');
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
    argNumber: '1',
    helpGroup: 'List',
	description: 'Remove one of your lists',
    example: '``' + prefix + 'removelist myRossoList``',
    additionalInfo: '',
	async execute(message, args, client) {
		await removeList(message, args, client);
	}
}