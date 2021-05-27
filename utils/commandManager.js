
const helper = require('./listHelper');
const { prefix } = require('../config.json');

function commandManager(message, client) {
    if (!message.content.startsWith(prefix) || message.author.bot) { return; };

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	if (command.helpGroup == 'Debug' && message.author.id != '204486578482053120') {
		return;
	}

    if (!helper.checkArgNumberBetween(command, message, args, command.nbArgsMin, command.nbArgsMax)) {
        return;
    }

	for ([index, arg] of args.entries()) {
		args[index] = arg.toLowerCase();
	}

    command.execute(message, args, client);
}

exports.commandManager = commandManager;