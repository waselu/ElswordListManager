
const { prefix, attributes } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function waitResetConfirmation(message, args, list) {
    resetArray = [];
    for (arg of args) {
        if (helper.isResetConfig(arg, list[message.author.id]['lists'][list[message.author.id]['active']]['type'])) {
            resetArray.push(arg);
        }
    }

    let confirm = true;
    if (resetArray.length > 0) {
        confirm = await new Promise(async (resolve, reject) => {
            await message.lineReply('Setting configuration' + (resetArray.length > 1 ? 's' : '') + ' ' + resetArray.join(', ') + ' will apply a daily and weekly reset on your list, are you sure?').then(function(sent) {
                sent.react('✅');
                sent.react('❌');
                sent.awaitReactions(function(reaction, user) {return user.id == message.author.id;}, {max: 1}).then(function(collected) {
                    let reaction = collected.first();
                    if (reaction.emoji.name === '✅') {
                        resolve(true);
                        return;
                    } else if (reaction.emoji.name === '❌') {
                        resolve(false);
                        return;
                    }
                });
            })
        });
    }

    return confirm;
}

async function setConfig(message, args, client, ignoreMessage) {
    let list = saveManager.getList();
    let listName = list[message.author.id]['active'];

    //Keeping those as example
    function call2Fresh(message, invert) {return invert ? {'error': 'You cannot remove this configuration'} : {'freshbehavior': '2fresh', 'reset': true};}
    function call1Fresh(message, invert) {return invert ? {'error': 'You cannot remove this configuration'} : {'freshbehavior': '1fresh', 'reset': true};}
    function callWithReset(message, invert) {return invert ? {'error': 'You cannot remove this configuration'} : {'freshbehavior': 'withreset', 'reset': true};}

    let attributeCases = [
        {'attribute': '2fresh', 'call': call2Fresh},
        {'attribute': '1fresh', 'call': call1Fresh},
        {'attribute': 'withreset', 'call': callWithReset}
    ]

    async function setAttribute(message, attribute, invert) {
        let setObject = {};
        setObject[attribute] = !invert;
        let skip = 0;
        for (attributeCase of attributeCases) {
            if (attributeCase["attribute"] == attribute) {
                setObject = attributeCase["call"](message);
                if ('skip' in setObject && setObject['skip']) {
                    skip = setObject['skip'];
                    setObject['skip'] = 0;
                }
                if ('reset' in setObject) {
                    helper.specResetWeekly(list[message.author.id]['lists'][listName]);
                    helper.specResetDaily(list[message.author.id]['lists'][listName]);
                }
                if ('error' in setObject) {
                    await helper.sendBotMessage(message, setObject['error']);
                    return -1;
                }
            }
        }

        for (attributeName in setObject) {
            list[message.author.id]['lists'][listName]['config'][attributeName] = setObject[attributeName];
        }

        return skip;
    }

    async function listFound(message) {
        let confirm = await waitResetConfirmation(message, args, list);
        if (!confirm) {
            await message.channel.send('SetConfig cancelled');
            return;
        }

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

            if (!helper.canSetConfig(attribute, list[message.author.id]['lists'][listName]['type'])) {
                await helper.sendBotMessage(message, "Attribute '" + attribute + "' is not available for this list");
                return;
            }
            
            skip = await setAttribute(message, attribute, invertAttr);
            if (skip == -1) {
                return;
            }

            invertAttr = false;
        }

        await helper.sendUserList(message, list, client);
    }

    async function listNotFound(message) {
        await helper.sendBotMessage(message, "You have no list named " + listName);
    }

    async function userNotFound(message) {
        await helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfListFoundInUserList(message, listName, listFound, listNotFound, userNotFound);
}

module.exports = {
	name: 'setconfig',
    nbArgsMin: 1,
    helpGroup: 'List',
	description: 'Set one or many configuration(s) for your current list\ntype ``' + prefix + 'helpconfig [configuration]`` for more help eg. ``' + prefix + 'helpconfig withReset``',
    example: '``' + prefix + 'setconfig 2fresh``\n\n' +
            '**List of available configurations**\n' +
            helper.generateSetConfigExample() + '\n',
    additionalInfo: 'You can add no/not before a configuration to remove it',
	async execute(message, args, client) {
		await setConfig(message, args, client);
	}
}