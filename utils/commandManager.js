
const helper = require('./listHelper');
const logs = require('./logs');
const { prefix } = require('../config.json');

function checkArgNumberBetween(command, message, args, moreThan = -1, lessThan = -1) {
    expectedStr = 'expected number of argument';
    if (moreThan == -1 && lessThan == -1 ) { return true; };
    if (moreThan != -1 && lessThan == -1) { expectedStr += ' higher than ' + (moreThan - 1); }
    else if (moreThan == - 1 && lessThan != - 1) { expectedStr += ' lower than ' + (lessThan + 1); }
    else if (moreThan == lessThan) { expectedStr += ': ' + moreThan; }
    else { expectedStr += ' between ' + (moreThan - 1) + ' and ' + (lessThan + 1)};
    
    if (moreThan != -1 && args.length < moreThan) {
        helper.sendBotMessage(message, 'Not enough arguments provided to command ``' + command.name + '``\n' + expectedStr)
        return false;
    }
    if (lessThan != -1 && args.length > lessThan) {
        helper.sendBotMessage(message, 'Too many arguments provided to command ``' + command.name + '``\n' + expectedStr)
        return false;
    }
    return true
}

function commandManager(message, client) {
    if (!message.content.startsWith(prefix) || message.author.bot) { return; };

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	if (command.helpGroup == 'Debug' && message.author.id != '204486578482053120') {
		return;
	}

    if (!checkArgNumberBetween(command, message, args, command.nbArgsMin, command.nbArgsMax)) {
        return;
    }

    logs.log(message, command, args);
    command.execute(message, args.map(function(arg) {return arg.toLowerCase();}), args, client);
}

exports.commandManager = commandManager;