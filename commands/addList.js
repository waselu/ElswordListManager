
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function addOneCharacter(message, args, client, index) {
    setArgs = [args[index]];
    await client.commands.get('add').execute(message, [args[index]], client, true);

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
    }

    await client.commands.get('list').execute(message, [], client);
    saveManager.setList(saveManager.getList());
}

module.exports = {
	name: 'addlist',
    argNumber: '>0',
	description: 'Directly add characters and properties to your list, this is ike calling add and set multiple times',
    example: '``' + prefix + 'addlist CL sage not fresh farm NP not fresh freeze KE dps farm IN speed DiA``',
    additionalInfo: '',
	async execute(message, args, client) {
		await addList(message, args, client);
	}
}