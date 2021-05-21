
const { prefix, attributes } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function set(message, args, client, ignoreMessage) {
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
        if (helper.checkUserListHasChar(message.author.id, args[indexArg + 1]) != -1) {
            return {"error": "You already have a character named " + args[indexArg + 1]};
        }
        return {"alias": args[indexArg + 1], "skip": 1};
    }
    function callHeroicDaily(message, classDef, invert, args, indexArg) {
        if (invert) {
            return {'heroicdaily': 0};
        }
        if (indexArg == args.length - 1) {
            return {'error': 'No run number specified'};
        }
        let nbRun = parseInt(args[indexArg + 1]);
        if (nbRun < 0) {
            nbRun = 0;
        }
        if (nbRun > 3) {
            nbRun = 3;
        }
        if (isNaN(nbRun)) {
            return {'error': 'Bad run number specified'}
        }
        return {'heroicdaily': nbRun, 'skip' : 1};
    }
    function callHeroicWeekly(message, classDef, invert, args, indexArg) {
        if (invert) {
            return {'heroicweekly': 0};
        }
        if (indexArg == args.length - 1) {
            return {'error': 'No run number specified'};
        }
        let nbRun = parseInt(args[indexArg + 1]);
        if (nbRun < 0) {
            nbRun = 0;
        }
        if (nbRun > 10) {
            nbRun = 10;
        }
        if (isNaN(nbRun)) {
            return {'error': 'Bad run number specified'}
        }
        return {'heroicweekly': nbRun, 'skip' : 1};
    }

    let attributeCases = [
        {'attribute': 'fresh', 'call': callFresh},
        {'attribute': 'reset', 'call': callReset},
        {'attribute': 'red', 'call': callStoneRed},
        {'attribute': 'blue', 'call': callStoneBlue},
        {'attribute': 'yellow', 'call': callStoneYellow},
        {'attribute': 'giant', 'call': callStoneGiant},
        {'attribute': 'nostone', 'call': callStoneNostone},
        {'attribute': 'alias', 'call': callAlias},
        {'attribute': 'heroicdaily', 'call': callHeroicDaily},
        {'attribute': 'heroicweekly', 'call': callHeroicWeekly}
    ]

    async function setAttribute(message, index, attribute, invert, args, indexArg) {
        let setObject = {};
        setObject[attribute] = !invert;
        let skip = 0;
        for (attributeCase of attributeCases) {
            if (attributeCase["attribute"] == attribute) {
                setObject = attributeCase["call"](message, list[message.author.id][index], invert, args, indexArg);
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
            list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index][attributeName] = setObject[attributeName];
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

            if (!helper.canSetAttribute(attribute, list[message.author.id]['lists'][list[message.author.id]['active']]['type'])) {
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
            await helper.sendUserList(message, list, true, client);
        }
    }

    async function classNotFound(message, realName) {
        await helper.sendBotMessage(message, realName + " was not found in your list");
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);
}

module.exports = {
	name: 'set',
    nbArgsMin: 2,
    nbArgsMax: 2,
    helpGroup: 'Characters',
	description: 'Set one or many attribute(s) for one of your character\ntype ``' + prefix + 'helpattr [attribute]`` for more help eg. ``' + prefix + 'helpattr dps``',
    example: '``' + prefix + 'set NP sage freeze``\n``' + prefix + 'set devi dps not fresh farm``\n``' + prefix + 'set shakti alias Eva``\n``' + prefix + 'set shakti no alias``\n\n' +
            '**List of available attributes**\n' +
            helper.generateSetExample() + '\n',
    additionalInfo: 'You can add no/not before an attribute to remove it',
	async execute(message, args, client, ignoreMessage = false) {
		await set(message, args, client, ignoreMessage);
	}
}