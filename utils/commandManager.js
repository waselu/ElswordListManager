
const helper = require('./listHelper');
const { prefix } = require('../config.json');

function commandManager(command, message, args, client) {
    if (!helper.checkArgNumberBetween(command, message, args, command.nbArgsMin, command.nbArgsMax)) {
        return;
    }

    command.execute(message, args, client);
}

exports.commandManager = commandManager;