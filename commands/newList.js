const { prefix, typelists } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function newList(message, args, client) {
    list = saveManager.getList();
    async function addNewList() {
        list[message.author.username]['active'] = args[1];
        if (!(args[1] in list[message.author.username]['lists'])) {
            list[message.author.username]['lists'][args[1]] = {'type': args[0], 'list': []};
            saveManager.setList(list);
            await helper.sendBotMessage(message, args[1] + " list created, swapped to it");
        } else {
            await helper.sendBotMessage(message, 'You already have a list named ' + args[1] + ', swapped to it');
        }
    }

    async function userFound(message) {
        await addNewList();
    }

    async function userNotFound(message) {
        list[message.author.username] = {
            'active': args[1],
            'lists': {

            }
        }
        await addNewList();
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
}

module.exports = {
	name: 'newlist',
    argNumber: '>1',
    helpGroup: 'List',
	description: 'Add a new list of the specified type and an alias for it, then swap to it',
    example: '``' + prefix + 'newlist rosso myRaidList``\n\n**Available types**\n' + typelists.join(' '),
    additionalInfo: '',
	async execute(message, args, client) {
		await newList(message, args, client);
	}
}