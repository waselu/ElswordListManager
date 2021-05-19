
const copy = require('clipboardy');
const { MessageEmbed } = require('discord.js');
const { classes, attributes } = require('../config.json');
const saveManager = require('./saveManager');

function findElswordClass(elswordClass) {
	for (const [index, definedClass] of classes.entries()) {
		for (const [indexClassNaming, classNaming] of definedClass.classNaming.entries()) {
			if (classNaming.toLowerCase() == elswordClass.toLowerCase()) {
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
        if (attributeDef['name'] == attribute) {
            return type ? attributeDef['canSet'].includes(type) : (attributeDef['canSet'].length > 0);
        }
	}
    return false;
}

function isDefaultAttribute(attribute, type = null) {
    for (attributeDef of attributes) {
        if (attributeDef['name'] == attribute) {
            return type ? attributeDef['isDefault'].includes(type) : (attributeDef['isDefault'].length > 0);
        }
    }
    return false;
}

function checkUserListHasChar(user, className) {
    let userList = saveManager.getList()[user];
    userList = userList['lists'][userList['active']]['list'];
    for ([index, classDef] of userList.entries()) {
        if (classDef['alias'] != null) {
            if (classDef['alias'].toLowerCase() == className.toLowerCase()) {
                return index;
            }
        } else if (classDef["className"].toLowerCase() == className.toLowerCase()) {
            return index;
        }
	}
    return -1;
}

async function doIfUserFoundInUserList(message, successFunction, failureFunction) {
	let list = saveManager.getList();
    if (!(message.author.username in list)) {
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
            await message.channel.send(className + " was not found");
            return;
        }
        realName = className;
    }

    async function userFound(message) {
        let index = checkUserListHasChar(message.author.username, realName);
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

function userListToServerList(user, emojis = true) {
	let list = saveManager.getList();

    if (!(user in list)) {
        return "You have no list yet";
    }

    let userList = JSON.parse(JSON.stringify(list[user]['lists'][list[user]['active']]['list']));
    removed = true;
    while (removed) {
        removed = false;
        for ([index, classDef] of userList.entries()) {
            if (!(classDef['fresh']) && !(classDef['reset']) && !(classDef['farm'])) {
                userList.splice(index, 1);
                removed = true;
                break;
            }
        }
    }

    let raidString = "";
    for ([index, classDef] of userList.entries()) {
        if (classDef['fresh'] || classDef['reset'] || classDef['farm']) {
            raidString += emojis ? classDef["emoji"] + ' ' : ':' + classDef["className"] + ': '
            if (classDef['dps']) { raidString += emojis ? findEmojiByAttributeName("dps") + ' ' : ':' + findEmojiByAttributeName("dps", true) + ': '; }
            if (classDef['sage']) { raidString += emojis ? findEmojiByAttributeName("sage") + ' ' : ':' + findEmojiByAttributeName("sage", true) + ': '; }
            if (classDef['speed']) { raidString += emojis ? findEmojiByAttributeName("speed") + ' ' : ':' + findEmojiByAttributeName("speed", true) + ': '; }
            if (classDef['stone'] != null && (classDef['fresh'] || classDef['reset'])) { raidString += emojis ? findEmojiByAttributeName(classDef['stone']) + ' ' : ':' + findEmojiByAttributeName(classDef["stone"], true) + ': '; }
            if (classDef['freeze']) { raidString += ':ice_cube: '; }
            if (index < userList.length && (index == userList.length - 1 || classDef['fresh'] != userList[index + 1]['fresh'] || classDef['reset'] != userList[index + 1]['reset'] || classDef['break'])) {
                if (classDef['fresh']) { raidString += emojis ? findEmojiByAttributeName("fresh") + ' ' : ':' + findEmojiByAttributeName("fresh", true) + ': '; }
                else if (classDef['reset']) { raidString += emojis ? findEmojiByAttributeName("reset") + ' ' : ':' + findEmojiByAttributeName("reset", true) + ': '; }
                else { raidString += emojis ? findEmojiByAttributeName("flamemark") + ' ' : ':' + findEmojiByAttributeName("flamemark", true) + ': '; }
            }
            if (classDef['break']) { raidString += '\n' }
        }
    }

    return raidString ? raidString : "Your list is empty"
}

function copyList(username) {
    copy.writeSync(userListToServerList(username, false));
}

async function sendBotMessage(message, sending) {
    discordMessage = await message.channel.send(sending);
    discordMessage.delete({timeout: 600000});
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

async function sendUserList(message, list = null, copy = true) {
    let getTypeList = saveManager.getList();
    await sendBasicBotEmbed(message, message.author.username + '\'s list: ' + getTypeList[message.author.username]['active'], userListToServerList(message.author.username), 'Your list has been copied to your clipboard');
    if (list) {
        saveManager.setList(list);
    }
    if (copy) {
        copyList(message.author.username);
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

function specResetWeekly(list) {
    for ([index, classDef] of list['list'].entries()) {
        switch (list['type']) {
            case 'rosso':
                list['list'][index]['fresh'] = true;
                list['list'][index]['reset'] = false;
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

function resetDaily() {
    //Implement when heroic is running
}

exports.findElswordClass = findElswordClass;
exports.findEmojiByClassName = findEmojiByClassName;
exports.findEmojiByAttributeName = findEmojiByAttributeName;
exports.canSetAttribute = canSetAttribute;
exports.isDefaultAttribute = isDefaultAttribute;
exports.checkUserListHasChar = checkUserListHasChar;
exports.doIfUserFoundInUserList = doIfUserFoundInUserList;
exports.doIfClassFoundInUserList = doIfClassFoundInUserList;
exports.userListToServerList = userListToServerList;
exports.copyList = copyList;
exports.sendBotMessage = sendBotMessage;
exports.sendFormalBotMessage = sendFormalBotMessage;
exports.sendBasicBotEmbed = sendBasicBotEmbed;
exports.sendUserList = sendUserList;
exports.generateSetExample = generateSetExample;
exports.resetWeekly = resetWeekly;
exports.resetDaily = resetDaily;