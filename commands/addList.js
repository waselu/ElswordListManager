
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

function addOneCharacter(message, args, client, index) {
    setArgs = [args[index]];
    client.commands.get('add').execute(message, [args[index]], client, true);

    index = index + 1;
    while (index < args.length && !helper.findElswordClass(args[index])) {
        setArgs.push(args[index]);
        index += 1;
    }
    client.commands.get('set').execute(message, setArgs, client, true);

    return index;
}

function addList(message, args, client) {
    let index = 0;

    while (index < args.length) {
        index = addOneCharacter(message, args, client, index);
    }

    client.commands.get('list').execute(message, [], client);
    saveManager.setList(saveManager.getList());
}

module.exports = {
	name: 'addlist',
    argNumber: '>0',
	description: 'Directly add characters and properties to your list, this is ike calling add and set multiple times',
    example: '``' + prefix + '``',
    additionalInfo: '',
	execute(message, args, client) {
		addList(message, args, client);
	}
}