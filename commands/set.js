
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function set(message, args, ignoreMessage) {
    let list = saveManager.getList();
    let className = args[0];
    args.splice(0, 1);

    function callFresh(message, classDef, invert, args, indexArg) {return !invert ? {"fresh": true, "reset": false} : {"fresh": false, "reset": false};}
    function callReset(message, classDef, invert, args, indexArg) {return !invert ? {"fresh": false, "reset": true} : {"reset": false};}
    function callStone(message, classDef, invert, stoneColor) {
        if (stoneColor == "nostone") {
            return !invert ? {"stone": null} : {};
        }
        if (invert) {
            return (classDef["stone"] == stoneColor) ? {"stone": null} : {};
        }
        return {"stone": stoneColor};
    }
    function callStoneRed(message, classDef, invert, args, indexArg) {return callStone(message, classDef, invert, "red");}
    function callStoneBlue(message, classDef, invert, args, indexArg) {return callStone(message, classDef, invert, "blue");}
    function callStoneYellow(message, classDef, invert, args, indexArg) {return callStone(message, classDef, invert, "yellow");}
    function callStoneGiant(message, classDef, invert, args, indexArg) {return callStone(message, classDef, invert, "giant");}
    function callStoneNostone(message, classDef, invert, args, indexArg) {return callStone(message, classDef, invert, "nostone");}
    function callAlias(message, classDef, invert, args, indexArg) {
        if (invert) {
            return {"alias": null};
        }
        if (indexArg == args.length - 1) {
            return {"error": "No alias specified"};
        }
        if (helper.checkUserListHasChar(message.author.username, args[indexArg + 1]) != -1) {
            return {"error": "You already have a character named " + args[indexArg + 1]};
        }
        return {"alias": args[indexArg + 1], "skip": 1};
    }

    let attributeCases = [
        {"attribute": "fresh", "call": callFresh},
        {"attribute": "reset", "call": callReset},
        {"attribute": "red", "call": callStoneRed},
        {"attribute": "blue", "call": callStoneBlue},
        {"attribute": "yellow", "call": callStoneYellow},
        {"attribute": "giant", "call": callStoneGiant},
        {"attribute": "nostone", "call": callStoneNostone},
        {"attribute": "alias", "call": callAlias}
    ]

    async function setAttribute(message, index, attribute, invert, args, indexArg) {
        let setObject = {};
        setObject[attribute] = !invert;
        let skip = 0;
        for (attributeCase of attributeCases) {
            if (attributeCase["attribute"] == attribute) {
                setObject = attributeCase["call"](message, list[message.author.username][index], invert, args, indexArg);
                if ('skip' in setObject && setObject['skip']) {
                    skip = setObject['skip'];
                    setObject['skip'] = 0;
                }
                if ('error' in setObject) {
                    await helper.sendBotMessage(message, setObject['error']);
                    return -1;
                }
            }
        }

        for (attributeName in setObject) {
            list[message.author.username]['lists'][list[message.author.username]['active']]['list'][index][attributeName] = setObject[attributeName];
        }

        return skip;
    }

    async function classFound(message, index, realName) {
        let invertAttr = false
        let skip = 0
        for ([indexArg, attribute] of args.entries()) {
            if (skip > 0) {
                skip -= 1;
                continue;
            }

            if (attribute == 'not' || attribute == 'no') {
                invertAttr = true;
                continue;
            }

            if (!helper.canSetAttribute(attribute, list[message.author.username]['lists'][list[message.author.username]['active']]['type'])) {
                await helper.sendBotMessage(message, "Attribute '" + attribute + "' is not available for this list");
                return;
            }
            
            skip = await setAttribute(message, index, attribute, invertAttr, args, indexArg);
            if (skip == -1) {
                return;
            }

            invertAttr = false;
        }

        if (!ignoreMessage) {
            await helper.sendUserList(message, list);
        }
    }

    async function classNotFound(message, realName) {
        await helper.sendBotMessage(message, realName + " was not found in your list");
        await helper.sendBotMessage(message, helper.userListToServerList(message.author.username));
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);
}

module.exports = {
	name: 'set',
    argNumber: '>1',
    helpGroup: 'Characters',
	description: 'Set one or many property(ies) for one of your character',
    example: '``' + prefix + 'set NP sage freeze``\n``' + prefix + 'set devi dps not fresh farm``\n``' + prefix + 'set shakti alias Eva``\n``' + prefix + 'set shakti no alias``\n\n' +
            'List of available attributes:\n' +
            '``dps`` ``sage`` ``speed`` ``freeze``\n' +
            '``fresh`` ``reset``\n'+
            '``red`` ``blue`` ``yellow`` ``giant`` ``nostone``\n' +
            '``farm`` ``linebreak``\n' +
            '``alias [name]``\n\n' +
            'Setting an alias will make you only able to reference that ' +
            'character by its alias and no longer by its class name, ' +
            'additionally it will make you able to add another character of that class to your list\n' +
            '(The requirement being that you do not have 2 characters with the same name)',
    additionalInfo: 'You can add no/not before a property to remove it',
	async execute(message, args, client, ignoreMessage = false) {
		await set(message, args, ignoreMessage);
	}
}