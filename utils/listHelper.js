
const copy = require('clipboardy');
const { MessageEmbed } = require('discord.js');
const { classes, attributes, configurations } = require('../config.json');
const saveManager = require('./saveManager');

function findElswordClass(elswordClass) {
	for (const [index, definedClass] of classes.entries()) {
		for (const [indexClassNaming, classNaming] of definedClass.classNaming.entries()) {
			if (classNaming.toLowerCase() == elswordClass) {
				return {"name": definedClass.classNaming[0], "index": index};
			}
		}
	}
	return null;
}

function findEmojiByClassName(elswordClass) {
	let realName = findElswordClass(elswordClass)
    if (!realName) {
    	return null;
    }
    realName = realName["name"]
    for (classDef of classes) {
       if (realName == classDef['classNaming'][0]) {
           return classDef['emoji'];
       }
    }
    return null;
}

function findEmojiByAttributeName(attribute, forServer = false) {
    for (attributeDef of attributes) {
        if (attributeDef['name'] == attribute) {
            return forServer ? attributeDef['serverEmoji'] : attributeDef['emoji'];
        }
    }
    return null;
}

function canSetAttribute(attribute, type = null) {
	for (attributeDef of attributes) {
        if (attributeDef['name'].toLowerCase() == attribute) {
            return type ? attributeDef['canSet'].includes(type) : (attributeDef['canSet'].length > 0);
        }
	}
    return false;
}

function isDefaultAttribute(attribute, type = null) {
    for (attributeDef of attributes) {
        if (attributeDef['name'].toLowerCase() == attribute) {
            return type ? attributeDef['isDefault'].includes(type) : (attributeDef['isDefault'].length > 0);
        }
    }
    return false;
}

function canSetConfig(configKey, type = null) {
    for (configDef of configurations) {
        if (configDef['name'] == configKey) {
            return type ? configDef['canSet'].includes(type) : (configDef['canSet'].length > 0);
        }
    }
    return false;
}

function isDefaultConfig(configKey, type = null) {
    for (configDef of configurations) {
        if (configDef['name'] == configKey) {
            return type ? configDef['isDefault'].includes(type) : (configDef['isDefault'].length > 0);
        }
    }
    return false;
}

function checkUserListHasChar(user, className) {
    let userList = saveManager.getList()[user];
    userList = userList['lists'][userList['active']]['list'];
    for ([index, classDef] of userList.entries()) {
        if (classDef['alias'] != null) {
            if (classDef['alias'] == className) {
                return index;
            }
        } else if (classDef["className"] == className) {
            return index;
        }
	}
    return -1;
}

async function doIfUserFoundInUserList(message, successFunction, failureFunction) {
	let list = saveManager.getList();
    if (!(message.author.id in list)) {
        await failureFunction(message);
    }
    else {
        await successFunction(message);
    }
}

async function doIfClassFoundInUserList(message, className, successFunction, failureFunction, userNotFoundFunction, strictMode = false) {
    let realName = findElswordClass(className);

    if (realName) {
        realName = realName["name"];
    } else {
        if (strictMode) {
            await message.lineReply(className + " was not found");
            return;
        }
        realName = className;
    }

    async function userFound(message) {
        let index = checkUserListHasChar(message.author.id, realName);
        if (index == -1) {
            await failureFunction(message, realName);
        } else {
            await successFunction(message, index, realName);
        }
    }

    async function userNotFound(message) {
        await userNotFoundFunction(message, realName);
    }

    await doIfUserFoundInUserList(message, userFound, userNotFound);
}

async function doIfListFoundInUserList(message, className, successFunction, failureFunction, userNotFoundFunction) {

}

function removeDoneCharacters(userList, removeIfFunction) {
    removed = true;
    while (removed) {
        removed = false;
        for ([index, classDef] of userList.entries()) {
            if (removeIfFunction(classDef)) {
                userList.splice(index, 1);
                removed = true;
                break;
            }
        }
    }

    return userList;
}

function rossoList(userList, emojis = true) {
    userList = removeDoneCharacters(userList, function(classDef) {
        return !(classDef['fresh']) && !(classDef['reset']) && !(classDef['farm']);
    });

    userList = userList.sort(function(classDefA, classDefB) {
        scoreA = (classDefA['fresh'] === true ? 1 : 0) * 1 + (classDefA['reset'] === true ? 1 : 0) * 2;
        scoreB = (classDefB['fresh'] === true ? 1 : 0) * 1 + (classDefB['reset'] === true ? 1 : 0) * 2;

        scoreA = !scoreA ? 4 : scoreA;
        scoreB = !scoreB ? 4 : scoreB;

        return scoreA - scoreB;
    });

    let listString = '';
    for ([index, classDef] of userList.entries()) {
        if (classDef['fresh'] || classDef['reset'] || classDef['farm']) {
            listString += emojis ? classDef["emoji"] + ' ' : ':' + classDef["className"] + ': '
            if (classDef['dps']) { listString += emojis ? findEmojiByAttributeName("dps") + ' ' : ':' + findEmojiByAttributeName("dps", true) + ': '; }
            if (classDef['sage']) { listString += emojis ? findEmojiByAttributeName("sage") + ' ' : ':' + findEmojiByAttributeName("sage", true) + ': '; }
            if (classDef['speed']) { listString += emojis ? findEmojiByAttributeName("speed") + ' ' : ':' + findEmojiByAttributeName("speed", true) + ': '; }
            if (classDef['stone'] != null && (classDef['fresh'] || classDef['reset'])) { listString += emojis ? findEmojiByAttributeName(classDef['stone']) + ' ' : ':' + findEmojiByAttributeName(classDef["stone"], true) + ': '; }
            if (classDef['freeze']) { listString += ':ice_cube: '; }
            if (index < userList.length && (index == userList.length - 1 || classDef['fresh'] != userList[index + 1]['fresh'] || classDef['reset'] != userList[index + 1]['reset'] || classDef['break'])) {
                if (classDef['fresh']) { listString += emojis ? findEmojiByAttributeName("fresh") + ' ' : ':' + findEmojiByAttributeName("fresh", true) + ': '; }
                else if (classDef['reset']) { listString += emojis ? findEmojiByAttributeName("reset") + ' ' : ':' + findEmojiByAttributeName("reset", true) + ': '; }
                else { listString += emojis ? findEmojiByAttributeName("flamemark") + ' ' : ':' + findEmojiByAttributeName("flamemark", true) + ': '; }
            }
            if (classDef['linebreak']) { listString += '\n' }
        }
    }

    return listString;
}

function henirList(userList) {
    userList = removeDoneCharacters(userList, function(classDef) {
        return !(classDef['henirnormal']) && !(classDef['henirchallenge']);
    });

    userList = userList.sort(function(classDefA, classDefB) {
        scoreA = ((classDefA['henirnormal'] > 0) === true ? 1 : 0) * 1 + ((classDefA['henirchallenge'] > 0) === true ? 1 : 0) * 2;
        scoreB = ((classDefB['henirnormal'] > 0) === true ? 1 : 0) * 1 + ((classDefB['henirchallenge'] > 0) === true ? 1 : 0) * 2;

        return scoreA - scoreB;
    });

    let listString = '';
    for ([index, classDef] of userList.entries()) {
        listString += classDef["emoji"] + ' ';
        if (index < userList.length && (index == userList.length - 1 || classDef['henirnormal'] != userList[index + 1]['henirnormal'] || classDef['henirchallenge'] != userList[index + 1]['henirchallenge'] || classDef['break'])) {
            if (classDef['henirnormal']) { listString += findEmojiByAttributeName('henirnormal') + ' '; }
            if (classDef['henirchallenge']) { listString += findEmojiByAttributeName('henirchallenge') + ' '; }
        }
        if (classDef['linebreak']) { listString += '\n' }
    }

    return listString;
}

function heroicList(userList) {
    userList = removeDoneCharacters(userList, function(classDef) {
        return !(classDef['heroicdaily']) && !(classDef['heroicweekly']);
    });

    userList = userList.sort(function(classDefA, classDefB) {
        scoreA = ((classDefA['heroicdaily'] > 0) === true ? 1 : 0) * 1 + ((classDefA['heroicweekly'] > 0) === true ? 1 : 0) * 2;
        scoreB = ((classDefB['heroicdaily'] > 0) === true ? 1 : 0) * 1 + ((classDefB['heroicweekly'] > 0) === true ? 1 : 0) * 2;

        return scoreA - scoreB;
    });
    
    let listString = '';
    for ([index, classDef] of userList.entries()) {
        listString += classDef["emoji"] + ' ';
        if (index < userList.length && (index == userList.length - 1 || (classDef['heroicdaily'] > 0) != (userList[index + 1]['heroicdaily'] > 0) || (classDef['heroicweekly'] > 0) != (userList[index + 1]['heroicweekly'] > 0) || classDef['break'])) {
            if (classDef['heroicdaily']) { listString += findEmojiByAttributeName('heroicdaily') + ' '; }
            if (classDef['heroicweekly']) { listString += findEmojiByAttributeName('heroicweekly') + ' '; }
        }
        if (classDef['linebreak']) { listString += '\n' }
    }

    return listString;
}

function userListToEmojiList(user, emojis = true) {
	let list = saveManager.getList();

    if (!(user in list)) {
        return "You have no list yet";
    }

    let activeListType = list[user]['lists'][list[user]['active']]['type'];
    let userList = JSON.parse(JSON.stringify(list[user]['lists'][list[user]['active']]['list'])); //JSON used to copy DO NOT DELETE

    let listString = '';
    switch (activeListType) {
        case 'rosso':
            listString = rossoList(userList, emojis);
            break;
        case 'henir':
            listString = henirList(userList);
            break;
        case 'heroic':
            listString = heroicList(userList);
            break;
        default:
            break;
    }

    return listString ? listString : 'Your list is empty'
}

function copyList(userId) {
    copy.writeSync(userListToEmojiList(userId, false));
}

async function sendBotMessage(message, sending) {
    discordMessage = await message.lineReply(sending);
    //discordMessage.delete({timeout: 600000});
}

async function sendFormalBotMessage(message, sendingTitle = null, sending = null, title = null, description = null, footer = null, thumbnail = null) {
    let embed = new MessageEmbed()
	.setAuthor('Rosso raid manager', 'https://64.media.tumblr.com/4d56ac1bcd708c38392a6b37f98a68b8/tumblr_pozk3r9eiW1wsn58z_640.jpg')
	.setThumbnail(thumbnail)
	.setTitle(title)
	.setDescription(description)
	.addField(sendingTitle, sending)
	.setFooter(footer);

    await sendBotMessage(message, embed);
}

async function sendBasicBotEmbed(message, sendingTitle = null, sending = null, footer = null, thumbnail = null) {
    await sendFormalBotMessage(message, sendingTitle, sending, '', '', footer, thumbnail)
}

async function sendUserList(message, list = null, copy = true, client) {
    let getTypeList = saveManager.getList();
    await client.commands.get('show').execute(message, [], client);
    if (list) {
        saveManager.setList(list);
    }
    if (copy && getTypeList[message.author.id]['lists'][getTypeList[message.author.id]['active']]['type'] == 'rosso') {
        copyList(message.author.id);
    }
}

function generateSetExample() {
    helpStr = '';
    filteredAttributes = attributes.filter(function(attribute) { return attribute.canSet.length != 0; });
    for ([index, attribute] of filteredAttributes.entries()) {
        helpStr += '``' + attribute.name + (attribute.additionalHelp || '') + '`` ';
        if (index % 3 == 2) {
            helpStr += '\n';
        }
    }

    return helpStr;
}

function checkArgNumberBetween(command, message, args, moreThan = -1, lessThan = -1) {
    expectedStr = 'expected number of argument';
    if (moreThan == -1 && lessThan == -1 ) { return true; };
    if (moreThan != -1 && lessThan == -1) { expectedStr += ' higher than ' + (moreThan - 1); }
    else if (moreThan == - 1 && lessThan != - 1) { expectedStr += ' lower than ' + (lessThan + 1); }
    else if (moreThan == lessThan) { expectedStr += ': ' + moreThan; }
    else { expectedStr += ' between ' + (moreThan - 1) + ' and ' + (lessThan + 1)};
    
    if (moreThan != -1 && args.length < moreThan) {
        sendBotMessage(message, 'Not enough arguments provided to command ``' + command.name + '``\n' + expectedStr)
        return false;
    }
    if (lessThan != -1 && args.length > lessThan) {
        sendBotMessage(message, 'Too many arguments provided to command ``' + command.name + '``\n' + expectedStr)
        return false;
    }
    return true
}

function specResetWeekly(list) {
    for ([index, classDef] of list['list'].entries()) {
        switch (list['type']) {
            case 'rosso':
                list['list'][index]['fresh'] = true;
                list['list'][index]['reset'] = false;
                break;
            case 'henir':
                list['list'][index]['henirnormal'] = true;
                list['list'][index]['henirchallenge'] = true;
                break;
            case 'heroic':
                list['list'][index]['heroicweekly'] = 10;
                break;
            default:
                break;
        }
    }

    return list;
}

function resetWeekly() {
    let list = saveManager.getList(true);

    for ([user, listsSpec] of Object.entries(list)) {
        for ([listName, listSpec] of Object.entries(listsSpec['lists'])) {
            list[user]['lists'][listName] = specResetWeekly(list[user]['lists'][listName]);
        }
    }
    saveManager.setList(list);
}

function specResetDaily(list) {
    for ([index, classDef] of list['list'].entries()) {
        switch (list['type']) {
            case 'heroic':
                list['list'][index]['heroicdaily'] = 3;
                break;
            default:
                break;
        }
    }

    return list;
}

function resetDaily() {
    let list = saveManager.getList(true);

    for ([user, listsSpec] of Object.entries(list)) {
        for ([listName, listSpec] of Object.entries(listsSpec['lists'])) {
            list[user]['lists'][listName] = specResetDaily(list[user]['lists'][listName]);
        }
    }
    saveManager.setList(list);
}

exports.findElswordClass = findElswordClass;
exports.findEmojiByClassName = findEmojiByClassName;
exports.findEmojiByAttributeName = findEmojiByAttributeName;
exports.canSetAttribute = canSetAttribute;
exports.isDefaultAttribute = isDefaultAttribute;
exports.checkUserListHasChar = checkUserListHasChar;
exports.doIfUserFoundInUserList = doIfUserFoundInUserList;
exports.doIfClassFoundInUserList = doIfClassFoundInUserList;
exports.userListToEmojiList = userListToEmojiList;
exports.copyList = copyList;
exports.sendBotMessage = sendBotMessage;
exports.sendFormalBotMessage = sendFormalBotMessage;
exports.sendBasicBotEmbed = sendBasicBotEmbed;
exports.sendUserList = sendUserList;
exports.generateSetExample = generateSetExample;
exports.checkArgNumberBetween = checkArgNumberBetween;
exports.resetWeekly = resetWeekly;
exports.resetDaily = resetDaily;