
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function move(message, args, client) {
    let list = saveManager.getList();

    function getActualIndexMoveTo(indexMoveTo, user) {
        let charList = list[user]['lists'][list[user]['active']]['list'];
        let mustAdd = 0;
        indexMoveTo = indexMoveTo;
        for ([index, classDef] of charList.entries()) {
            if (index >= indexMoveTo + mustAdd) {
                break;
            }
            if (!classDef['fresh'] && !classDef['reset'] && !classDef['farm']) {
                mustAdd += 1;
            }
        }

        return indexMoveTo + mustAdd;
    }

    let classNames = [];
    let positions = [];

    for ([index, arg] of args.entries()) {
        if (index % 2 == 0) {
            classNames.push(arg);
        } else {
            positions.push(parseInt(arg));
        }
    }

    if (classNames.length != classNames.length) {
        await helper.sendBotMessage(message, "Bad syntax, check the help command");
        return;
    }

    for ([index, className] of classNames.entries()) {
        let indexMoveTo = positions[index];
        async function classFound(message, index, realName) {
            if (indexMoveTo <= 0 || indexMoveTo > list[message.author.id]['lists'][list[message.author.id]['active']]['list'].length) {
                await helper.sendBotMessage(message, "Index " + indexMoveTo + " isn't in your list");
                return;
            }
            indexMoveTo = getActualIndexMoveTo(indexMoveTo, message.author.id);
            let item = list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index];
            list[message.author.id]['lists'][list[message.author.id]['active']]['list'].splice(index, 1);
            list[message.author.id]['lists'][list[message.author.id]['active']]['list'].splice(indexMoveTo - 1, 0, item);
        }

        async function classNotFound(message, realName) {
            await helper.sendBotMessage(message, realName + " was not found in your list");
        }

        async function userNotFound(message, realName) {
            await helper.sendBotMessage(message, "You have no list yet");
        }

        await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);
    }

    await helper.sendUserList(message, list, true, client);
}

module.exports = {
    name: 'move',
    nbArgsMin: 1,
    helpGroup: 'Characters',
    description: 'Move one or many character(s) somewhere else in your list',
    example: '``' + prefix + 'move KE 3``\n``' + prefix + 'move Devi 5 RaS 1 NP 3``',
    additionalInfo: 'Characters will always be moved after those who aren\'t displayed',
    async execute(message, args, client) {
        await move(message, args, client);
    }
}