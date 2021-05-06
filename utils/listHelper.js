
const copy = require('clipboardy');
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

function canSetAttribute(attribute) {
	for (attributeDef of attributes) {
        if (attributeDef['name'] == attribute) {
            return attributeDef['canSet'];
        }
	}
    return false;
}

function isDefaultAttribute(attribute) {
    for (attributeDef of attributes) {
        if (attributeDef['name'] == attribute) {
            return attributeDef['isDefault'];
        }
    }
    return false;
}

function checkUserListHasChar(user, className) {
    let userList = saveManager.getList()[user];
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

    let userList = JSON.parse(JSON.stringify(list[user]));
    for ([index, classDef] of userList.entries()) {
        if (!(classDef['fresh']) && !(classDef['reset']) && !(classDef['farm'])) {
            userList.splice(index, 1);
        }
    }

    let raidString = "";
    for ([index, classDef] of userList.entries()) {
        if (classDef['fresh'] || classDef['reset'] || classDef['farm']) {
            raidString += emojis ? classDef["emoji"] + ' ' : ':' + classDef["className"] + ': '
            if (classDef['dps']) { raidString += emojis ? findEmojiByAttributeName("dps") + ' ' : ':' + findEmojiByAttributeName("dps", true) + ': ' }
            if (classDef['sage']) { raidString += emojis ? findEmojiByAttributeName("sage") + ' ' : ':' + findEmojiByAttributeName("sage", true) + ': ' }
            if (classDef['speed']) { raidString += emojis ? findEmojiByAttributeName("speed") + ' ' : ':' + findEmojiByAttributeName("speed", true) + ': ' }
            if (classDef['stone'] != null && (classDef['fresh'] || classDef['reset'])) { raidString += emojis ? findEmojiByAttributeName(classDef['stone']) + ' ' : ':' + findEmojiByAttributeName(classDef["stone"], true) + ': ' }
            if (index < userList.length && (index == userList.length - 1 || classDef['fresh'] != userList[index + 1]['fresh'] || classDef['reset'] != userList[index + 1]['reset'] || classDef['break'])) {
                if (classDef['fresh']) { raidString += emojis ? findEmojiByAttributeName("fresh") + ' ' : ':' + findEmojiByAttributeName("fresh", true) + ': ' }
                else if (classDef['reset']) { raidString += emojis ? findEmojiByAttributeName("reset") + ' ' : ':' + findEmojiByAttributeName("reset", true) + ': ' }
                else { raidString += emojis ? findEmojiByAttributeName("flamemark") + ' ' : ':' + findEmojiByAttributeName("flamemark", true) + ': '}
            }
            if (classDef['break']) { raidString += '\n' }
        }
    }

    return raidString ? raidString : "Your list is empty"
}

function copyList(username) {
    copy.writeSync(userListToServerList(username, false));
}

function sendBotMessage(message, sending) {
    message.channel.send(sending).then(function(discordMessage) {
        discordMessage.delete({timeout: 3000});
    })
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