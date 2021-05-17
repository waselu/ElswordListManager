
const { prefix, attributes } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function add(message, args) {
    let list = saveManager.getList();

    let ret = 0;

    async function classFound(message, index, realName) {
        await helper.sendBotMessage(message, "You already added " + realName + " to this list");
        ret = 1;
    }
    
    async function classNotFound(message, realName) {
        let attributesArray = {};

        for ([index, attributeDef] of attributes.entries()) {
            if (attributeDef["isDefault"]) {
                attributesArray[attributeDef["name"]] = attributeDef["value"];
            }
        }

        list[message.author.username]['lists'][list[message.author.username]['active']]['list'].push({...{"className": realName, "emoji": helper.findEmojiByClassName(realName)}, ...attributesArray});
        ret = 0;
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, 'You have no list yet');
        ret = -1;
    }

    await helper.doIfClassFoundInUserList(message, args[0], classFound, classNotFound, userNotFound, true)
    saveManager.setList(list);

    return ret;
}

async function addOneCharacter(message, args, client, index) {
    let setArgs = [args[index]];
    let added = await add(message, [args[index]]);

    if (added == -1) {
        return -1;   
    }

    index = index + 1;
    while (index < args.length && !helper.findElswordClass(args[index])) {
        setArgs.push(args[index]);
        index += 1;
    }
    await client.commands.get('set').execute(message, setArgs, client, true);

    return index;
}

async function addList(message, args, client) {
    let index = 0;

    while (index < args.length) {
        index = await addOneCharacter(message, args, client, index);
        if (index == -1) {
            return;
        }
    }

    await client.commands.get('list').execute(message, [], client);
    saveManager.setList(saveManager.getList());
}

module.exports = {
	name: 'add',
    argNumber: '>0',
	description: 'Add characters and properties to your list',
    example: '``' + prefix + 'addlist CL sage not fresh farm NP not fresh freeze KE dps farm IN speed DiA``',
    additionalInfo: '',
	async execute(message, args, client) {
		await addList(message, args, client);
	}
}