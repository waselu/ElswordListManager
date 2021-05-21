const { prefix, typelists, configurations } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function newList(message, args, client) {
    if (!typelists.includes(args[0])) {
        await helper.sendBotMessage(message, args[0] + ' is not a list type\nAvailable list types: ' + typelists.join(', '));
        return;
    }

    list = saveManager.getList();
    async function addNewList() {
        list[message.author.id]['active'] = args[1];
        if (!(args[1] in list[message.author.id]['lists'])) {
            let config = {};
            for (configDef of configurations) {
                if (configDef['isDefault'].includes(args[0])) {
                    config[configDef['name']] = configDef['value'];
                }
            }
            list[message.author.id]['lists'][args[1]] = {'type': args[0], 'config': config, 'list': []};
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
        list[message.author.id] = {
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