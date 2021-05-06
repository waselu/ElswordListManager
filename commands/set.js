
const { attributes, classes } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function set(message, args) {
    let list = saveManager.getList();
    let className = args[0];
    args.splice(0, 1);

    function callFresh(message, classDef, invert, args, indexArg) {
        return !invert ? {"fresh": true, "reset": false} : {"fresh": false, "reset": false};
    }

    function callReset(message, classDef, invert, args, indexArg) {
        return !invert ? {"fresh": false, "reset": true} : {"reset": false};
    }

    function callStone(message, classDef, invert, stoneColor) {
        if (stoneColor == "nostone") {
            return !invert ? {"stone": null} : {};
        }
        if (invert) {
            return (classDef["stone"] == stoneColor) ? {"stone": null} : {};
        }
        return {"stone": stoneColor};
    }

    function callStoneRed(message, classDef, invert, args, indexArg) {
        return callStone(message, classDef, invert, "red");
    }

    function callStoneBlue(message, classDef, invert, args, indexArg) {
        return callStone(message, classDef, invert, "blue");
    }

    function callStoneYellow(message, classDef, invert, args, indexArg) {
        return callStone(message, classDef, invert, "yellow");
    }

    function callStoneGiant(message, classDef, invert, args, indexArg) {
        return callStone(message, classDef, invert, "giant");
    }

    function callStoneNostone(message, classDef, invert, args, indexArg) {
        return callStone(message, classDef, invert, "nostone");
    }

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
                    await message.channel.send(setObject['error']);
                    return -1;
                }
            }
        }

        for (attributeName in setObject) {
            list[message.author.username][index][attributeName] = setObject[attributeName];
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

            if (!helper.canSetAttribute(attribute)) {
                await message.channel.send("Attribute '" + attribute + "' doesn't exist");
                return;
            }
            
            skip = await setAttribute(message, index, attribute, invertAttr, args, indexArg);
            if (skip == -1) {
                return;
            }

            invertAttr = false;
        }

        await message.channel.send(helper.userListToServerList(message.author.username))
        saveManager.setList(list);
    }

    async function classNotFound(message, realName) {
        message.channel.send(realName + " was not fount in your list");
        message.channel.send(userListToServerList(message.author.username));
    }

    async function userNotFound(message, realName) {
        message.channel.send("You have no list yet");
    }

    await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);
}

module.exports = {
	name: 'set',
	description: 'Set a property for one of your character',
	execute(message, args) {
		set(message, args);
	}
}