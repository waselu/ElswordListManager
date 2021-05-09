
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function move(message, args) {
    let list = saveManager.getList();

    function getActualIndexMoveTo(indexMoveTo, user) {
        let charList = list[user];
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
        helper.sendBotMessage(message, "Bad syntax, check the help command");
        return;
    }

    for ([index, className] of classNames.entries()) {
        let indexMoveTo = positions[index];
        async function classFound(message, index, realName) {
            if (indexMoveTo <= 0 || indexMoveTo > list[message.author.username].length) {
                helper.sendBotMessage(message, "Index " + indexMoveTo + " isn't in your list");
                return;
            }
            indexMoveTo = getActualIndexMoveTo(indexMoveTo, message.author.username);
            let item = list[message.author.username][index];
            list[message.author.username].splice(index, 1);
            list[message.author.username].splice(indexMoveTo - 1, 0, item);
        }

        async function classNotFound(message, realName) {
            helper.sendBotMessage(message, realName + " was not fount in your list");
        }

        async function userNotFound(message, realName) {
            helper.sendBotMessage(message, "You have no list yet");
        }

        await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);
    }

    helper.sendBotMessage(message, helper.userListToServerList(message.author.username));
    helper.copyList(message.author.username);
    saveManager.setList(list);
}

module.exports = {
    name: 'move',
    description: 'Move a character somewhere else in your list',
    execute(message, args, client) {
        move(message, args);
    }
}