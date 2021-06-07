
const fs = require('fs');

let logs = [];

function readLogs() {
    try {
        let data = fs.readFileSync('./logs.txt', {encoding:'utf8', flag:'a+'});
        logs = data.split(/\r?\n/);
    } catch (err) {
		console.error(err);
	}
}

function saveLogs() {
    try {
		fs.writeFileSync('./logs.txt', logs.join('\n'), {flag: 'w'});
	} catch (err) {
		console.error(err);
	}
}

function getLogs(reload = false) {
    if (reload) {
        readLogs();
    }
    return logs;
}

function log(message, command, args, save = true) {
    logs = [...[('[' + (new Date()).toLocaleString('fr-FR') + '] [' + message.author.username + '#' + message.author.discriminator + '] [' + message.author.id + '] ' + command.name + ' ' + args.join(' '))], ...logs];
    if (save) {
        saveLogs();
    }
}

exports.getLogs = getLogs;
exports.log = log;