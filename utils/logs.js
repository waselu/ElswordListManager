
const fs = require('fs');

let usedLogs = {};

function log(message, command, args) {
    let i = 0;
    let logs = [];
    while (usedLogs[i]) {i++;};
    usedLogs[i] = true;

    try {
        let data = fs.readFileSync('./logs/logs' + i + '.txt', {encoding:'utf8', flag:'a+'});
        logs = data.split(/\r?\n/);
    } catch (err) {
        console.log(err);
    }

    let date = new Date();
    logs = [...[('[' + date.toLocaleString('fr-FR') + '] [' + date.valueOf() + '] [' + message.author.username + '#' + message.author.discriminator + '] [' + message.author.id + '] ' + command.name + ' ' + args.join(' '))], ...logs];

    try {
        fs.writeFileSync('./logs/logs' + i + '.txt', logs.join('\n'), {flag: 'w'});
    } catch (err) {
        console.log(err);
    }

    usedLogs[i] = false;
}

function mergeLogs() {
    let i = 0;
    let logs = [];
    let readSuccess = true;

    while (readSuccess) {
        try {
            let data = fs.readFileSync('./logs/logs' + i + '.txt', {encoding:'utf8', flag:'r'});
            let specLogs = data.split(/\r?\n/);
            if (specLogs.length > 0 && !(specLogs.length === 1 && specLogs[0] === '')) {
                logs = [...logs, ...specLogs];
            }
            fs.unlink('./logs/logs' + i + '.txt', function() {});
            i++
        } catch (err) {
            readSuccess = false;
        }
    }

    logs = logs.filter(function(elem) {
        return elem !== '';
    })

    logs = logs.sort(function(elemA, elemB) {
        let timeStampA = parseInt(elemA.match(/\[(.*?)\]/g)[1].replace('[', '').replace(']', ''));
        let timeStampB = parseInt(elemB.match(/\[(.*?)\]/g)[1].replace('[', '').replace(']', ''));

        return timeStampB - timeStampA;
    })

    try {
        let data = fs.readFileSync('./logs.txt', {encoding:'utf8', flag:'a+'});
        logs = [...logs, ...data.split(/\r?\n/)].filter(function(elem) {
            return elem !== '';
        });
        fs.writeFileSync('./logs.txt', logs.join('\n'), {flag: 'w'});
    } catch (err) {
        console.log(err);
    }
}

exports.log = log;
exports.mergeLogs = mergeLogs;