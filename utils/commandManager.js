
const { prefix } = require('../config.json');

function commandManager(command, message, args, client) {
    let argNumber = command.argNumber;

    if (argNumber) {
        if (argNumber.substring(0, 1) === '<' && args.length >= parseInt(argNumber.substring(1))) {
            message.channel.send('Too many arguments to command ' + command.name + ', at most ' + (argNumber.substring(1) - 1) + ' arguments expected, use ' + prefix + 'help for more information');
            return;
        } else if (argNumber.substring(0, 1) === '>' && args.length <= parseInt(argNumber.substring(1))) {
            message.channel.send('Not enough arguments to command ' + command.name + ', at least ' + (parseInt(argNumber.substring(1)) + 1) + ' arguments expected, use ' + prefix + 'help for more information');
            return;
        }
        argNumber = parseInt(argNumber);
        if (args.length > argNumber) {
            message.channel.send('Too many arguments to command ' + command.name + ', ' + command.argNumber + ' arguments expected, use ' + prefix + 'help for more information');
            return;
        } else if (args.length < argNumber) {
            message.channel.send('Not enough arguments to command ' + command.name + ', ' + command.argNumber + ' arguments expected, use ' + prefix + 'help for more information');
            return;
        }
    }

    command.execute(message, args, client);
}

exports.commandManager = commandManager;