
const { classes, attributes, configurations } = require('../config.json');
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

function findEmojiIDByClassName(elswordClass) {
    let emoji = findEmojiByClassName(elswordClass);
    let emojiNumbers = emoji.match(/\d+/);

    return emojiNumbers ? emojiNumbers[0] : null;
}

function findEmojiByAttributeName(attribute, forServer = false) {
    for (attributeDef of attributes) {
        if (attributeDef['name'] == attribute) {
            return forServer ? attributeDef['serverEmoji'] : attributeDef['emoji'];
        }
    }
    return null;
}

function findEmojiIDByAttributeName(attribute) {
    let emoji = findEmojiByAttributeName(attribute);
    let emojiNumbers = emoji.match(/\d+/);

    return emojiNumbers ? emojiNumbers[0] : null;
}

function isDefaultAttribute(attribute, type = null) {
    for (attributeDef of attributes) {
        if (attributeDef['name'].toLowerCase() == attribute) {
            return type ? attributeDef['isDefault'].includes(type) : (attributeDef['isDefault'].length > 0);
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
            if (classDef['alias'].toLowerCase() == className.toLowerCase()) {
                return index;
            }
        } else if (classDef["className"].toLowerCase() == className.toLowerCase()) {
            return index;
        }
	}
    return -1;
}

function checkUserListHasList(user, list) {
    let userList = saveManager.getList()[user];
    for ([listName, listDef] of Object.entries(userList['lists'])) {
        if (listName == list) {
            return true;
        }
    }
    return false;
}

async function doIfUserFoundInUserList(message, successFunction, failureFunction) {
	let list = saveManager.getList();
    if (!(message.author.id in list)) {
        await failureFunction(message);
        return 1;
    }
    else {
        await successFunction(message);
        return 0;
    }
}

async function doIfClassFoundInUserList(message, className, successFunction, failureFunction, userNotFoundFunction, strictMode = false) {
    let realName = findElswordClass(className);

    if (realName) {
        realName = realName["name"];
    } else {
        if (strictMode) {
            await sendBotMessage(message, className + ' is not an Elsword class');
            return -1;
        }
        realName = className;
    }

    async function userFound(message) {
        let index = checkUserListHasChar(message.author.id, realName);
        if (index == -1) {
            await failureFunction(message, realName);
            return 1;
        } else {
            await successFunction(message, index, realName);
            return 0;
        }
    }

    async function userNotFound(message) {
        await userNotFoundFunction(message, realName);
        return 2;
    }

    await doIfUserFoundInUserList(message, userFound, userNotFound);
}

async function doIfListFoundInUserList(message, listName, successFunction, failureFunction, userNotFoundFunction) {
    async function userFound(message) {
        if (checkUserListHasList(message.author.id, listName)) {
            await successFunction(message);
            return 0;
        } else {
            await failureFunction(message);
            return 1;
        }
    }

    async function userNotFound(message) {
        await userNotFoundFunction(message);
        return 2;
    }

    await doIfUserFoundInUserList(message, userFound, userNotFound);
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

function generateListPerAttribute(userList, attributeRequirements) {
    let listArray = [];

    for (attributeRequirement of attributeRequirements) {
        listArray.push([]);
    }

    for (charDef of userList) {
        for ([indexList, attributeRequirement] of attributeRequirements.entries()) {
            let fine = true;
            for ([attributeName, attributeValue] of Object.entries(attributeRequirement)) {
                if (!((charDef[attributeName] >= 1) == attributeValue)) {
                    fine = false;
                    break;
                }
            }
            if (fine) {
                listArray[indexList].push(charDef);
                break;
            }
        }
    }

    return listArray.map(function(classList) {
        return classList.sort(function(classDefA, classDefB) {
            return findElswordClass(classDefA['className'])['index'] - findElswordClass(classDefB['className'])['index'];
        });
    }).flat();
}

function rossoList(userList, config, emojis = true) {
    userList = removeDoneCharacters(userList, function(classDef) {
        return !(classDef['fresh']) && !(classDef['reset']) && !(classDef['farm']);
    });

    userList = generateListPerAttribute(userList, [{'fresh': false, 'reset': false}, {'reset': true}, {'fresh': true}]);

    let listString = '';
    for ([index, classDef] of userList.entries()) {
        if (classDef['fresh'] || classDef['reset'] || classDef['farm']) {
            listString += emojis ? classDef["emoji"] + ' ' : ':' + classDef["className"] + ': '
            if (classDef['dps']) { listString += emojis ? findEmojiByAttributeName("dps") + ' ' : ':' + findEmojiByAttributeName("dps", true) + ': '; }
            if (classDef['sage']) { listString += emojis ? findEmojiByAttributeName("sage") + ' ' : ':' + findEmojiByAttributeName("sage", true) + ': '; }
            if (classDef['speed']) { listString += emojis ? findEmojiByAttributeName("speed") + ' ' : ':' + findEmojiByAttributeName("speed", true) + ': '; }
            if (classDef['stone'] != null && (classDef['fresh'] || classDef['reset'])) { listString += emojis ? findEmojiByAttributeName(classDef['stone']) + ' ' : ':' + findEmojiByAttributeName(classDef["stone"], true) + ': '; }
            if (classDef['freeze']) { listString += ':ice_cube: '; }
            if (index < userList.length && (index == userList.length - 1 || classDef['fresh'] != userList[index + 1]['fresh'] || classDef['reset'] != userList[index + 1]['reset'])) {
                if (classDef['fresh']) { listString += emojis ? findEmojiByAttributeName("fresh") + ' ' : ':' + findEmojiByAttributeName("fresh", true) + ': '; }
                else if (classDef['reset']) { listString += emojis ? findEmojiByAttributeName("reset") + ' ' : ':' + findEmojiByAttributeName("reset", true) + ': '; }
                else { listString += emojis ? findEmojiByAttributeName("flamemark") + ' ' : ':' + findEmojiByAttributeName("flamemark", true) + ': '; }
            }
        }
    }

    return listString;
}

function henirList(userList, config) {
    userList = removeDoneCharacters(userList, function(classDef) {
        return !(classDef['henirnormal']) && !(classDef['henirchallenge']);
    });

    userList = generateListPerAttribute(userList, [{'henirnormal': true, 'henirchallenge': false}, {'henirnormal': false, 'henirchallenge': true}, {'henirnormal': true, 'henirchallenge': true}]);

    let listString = '';
    for ([index, classDef] of userList.entries()) {
        listString += classDef["emoji"] + ' ';
        if (index < userList.length && (index == userList.length - 1 || classDef['henirnormal'] != userList[index + 1]['henirnormal'] || classDef['henirchallenge'] != userList[index + 1]['henirchallenge'])) {
            if (classDef['henirnormal']) { listString += findEmojiByAttributeName('henirnormal') + ' '; }
            if (classDef['henirchallenge']) { listString += findEmojiByAttributeName('henirchallenge') + ' '; }
        }
    }

    return listString;
}

function heroicList(userList, config) {
    userList = removeDoneCharacters(userList, function(classDef) {
        return !(classDef['heroicdaily']) && !(classDef['heroicweekly']);
    });

    userList = generateListPerAttribute(userList, [{'heroicdaily': true, 'heroicweekly': false}, {'heroicdaily': false, 'heroicweekly': true}, {'heroicdaily': true, 'heroicweekly': true}]);
    
    let listString = '';
    for ([index, classDef] of userList.entries()) {
        listString += classDef["emoji"] + ' ';
        if (index < userList.length && (index == userList.length - 1 || (classDef['heroicdaily'] > 0) != (userList[index + 1]['heroicdaily'] > 0) || (classDef['heroicweekly'] > 0) != (userList[index + 1]['heroicweekly'] > 0))) {
            if (classDef['heroicdaily']) { listString += findEmojiByAttributeName('heroicdaily') + ' '; }
            if (classDef['heroicweekly']) { listString += findEmojiByAttributeName('heroicweekly') + ' '; }
        }
    }

    return listString;
}

function rigomorList(userList, config) {
    userList = removeDoneCharacters(userList, function(classDef) {
        return !(classDef['rigomordaily']) && !(classDef['rigomorweekly']);
    });

    userList = generateListPerAttribute(userList, [{'rigomordaily': true, 'rigomorweekly': false}, {'rigomordaily': false, 'rigomorweekly': true}, {'rigomordaily': true, 'rigomorweekly': true}]);
    
    let listString = '';
    for ([index, classDef] of userList.entries()) {
        listString += classDef["emoji"] + ' ';
        if (index < userList.length && (index == userList.length - 1 || (classDef['rigomordaily'] > 0) != (userList[index + 1]['rigomordaily'] > 0) || (classDef['rigomorweekly'] > 0) != (userList[index + 1]['rigomorweekly'] > 0))) {
            if (classDef['rigomordaily']) { listString += findEmojiByAttributeName('rigomordaily') + ' '; }
            if (classDef['rigomorweekly']) { listString += findEmojiByAttributeName('rigomorweekly') + ' '; }
        }
    }

    return listString;
}

function sdList(userList, config) {
    userList = removeDoneCharacters(userList, function(classDef) {
        return !(classDef['sddaily']) && !(classDef['sdweekly']);
    });

    userList = generateListPerAttribute(userList, [{'sddaily': true, 'sdweekly': false}, {'sddaily': false, 'sdweekly': true}, {'sddaily': true, 'sdweekly': true}]);

    let listString = '';
    for ([index, classDef] of userList.entries()) {
        listString += classDef["emoji"] + ' ';
        if (index < userList.length && (index == userList.length - 1 || (classDef['sddaily'] > 0) != (userList[index + 1]['sddaily'] > 0) || (classDef['sdweekly'] > 0) != (userList[index + 1]['sdweekly'] > 0))) {
            if (classDef['sddaily']) { listString += findEmojiByAttributeName('sddaily') + ' '; }
            if (classDef['sdweekly']) { listString += findEmojiByAttributeName('sdweekly') + ' '; }
        }
    }

    return listString;
}

function userListToEmojiList(user, emojis = true) {
	let list = saveManager.getList();

    if (!(user in list)) {
        return "You have no list yet";
    }

    let activeListType = list[user]['lists'][list[user]['active']]['type'];
    let activeListConfig = list[user]['lists'][list[user]['active']]['config'];
    let userList = JSON.parse(JSON.stringify(list[user]['lists'][list[user]['active']]['list']));

    let listString = '';
    switch (activeListType) {
        case 'rosso':
            listString = rossoList(userList, activeListConfig, emojis);
            break;
        case 'henir':
            listString = henirList(userList, activeListConfig);
            break;
        case 'heroic':
            listString = heroicList(userList, activeListConfig);
            break;
        case 'rigomor':
            listString = rigomorList(userList, activeListConfig);
            break;
        case 'sd':
            listString = sdList(userList, activeListConfig);
            break;
        default:
            break;
    }

    return listString ? listString : 'Your list is empty'
}

function charDefToEmojiList(charDef) {
    let charList = '';

    function handleFresh(attrValue, charDef) {
        if (attrValue) {
            return findEmojiByAttributeName("fresh");
        }
        else if (!charDef["reset"]) {
            return findEmojiByAttributeName("flamemark")
        }
        return null;
    }

    function handleStone(attrValue, charDef) {
        if (!attrValue) {
            return null;
        }
        return findEmojiByAttributeName(attrValue);
    }

    let specListCases = {
        "fresh": handleFresh,
        "stone": handleStone
    };

    charList += charDef["emoji"];
    for (attribute in charDef) {
        attributeText = null;
        if (attribute in specListCases) {
            attributeText = specListCases[attribute](charDef[attribute], charDef);
        }
        else if (charDef[attribute]) {
            attributeText = findEmojiByAttributeName(attribute);
        }
        if (attributeText) {
            charList += " " + attributeText;
        }
    }

    return charList;
}

async function sendBotMessage(message, sending) {
    discordMessage = await message.lineReply(sending);
    //discordMessage.delete({timeout: 600000});
}

async function sendUserList(message, list = null, client) {
    await client.commands.get('show').execute(message, [], client);
    if (list) {
        saveManager.setList(list);
    }
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
                if (list['list'][index]['heroicweekly'] === 0) {
                    list['list'][index]['heroicweekly'] = 10;
                }
                break;
            case 'rigomor':
                if (list['list'][index]['rigomorweekly'] === 0) {
                    list['list'][index]['rigomorweekly'] = 15;
                }
                break;
            case 'sd':
                if (list['list'][index]['sdweekly'] === 0) {
                    list['list'][index]['sdweekly'] = 5;
                }
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
                if (list['list'][index]['heroicdaily'] === 0) {
                    list['list'][index]['heroicdaily'] = 3;
                }
                break;
            case 'rigomor':
                if (list['list'][index]['rigomordaily'] === 0) {
                    list['list'][index]['rigomordaily'] = 5;
                }
                break;
            case 'sd':
                if (list['list'][index]['sddaily'] === 0) {
                    list['list'][index]['sddaily'] = 2;
                }
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
exports.findEmojiIDByClassName = findEmojiIDByClassName;
exports.findEmojiByAttributeName = findEmojiByAttributeName;
exports.findEmojiIDByAttributeName = findEmojiIDByAttributeName;
exports.isDefaultAttribute = isDefaultAttribute;
exports.isDefaultConfig = isDefaultConfig;
exports.checkUserListHasChar = checkUserListHasChar;
exports.doIfUserFoundInUserList = doIfUserFoundInUserList;
exports.doIfClassFoundInUserList = doIfClassFoundInUserList;
exports.doIfListFoundInUserList = doIfListFoundInUserList;
exports.userListToEmojiList = userListToEmojiList;
exports.charDefToEmojiList = charDefToEmojiList;
exports.sendBotMessage = sendBotMessage;
exports.sendUserList = sendUserList;
exports.specResetWeekly = specResetWeekly;
exports.resetWeekly = resetWeekly;
exports.specResetDaily = specResetDaily;
exports.resetDaily = resetDaily;