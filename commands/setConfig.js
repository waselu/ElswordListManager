
const { prefix, attributes } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function setConfig(message, args, client, ignoreMessage) {
    let list = saveManager.getList();
    let listName = list[message.author.id]['active'];

    function call2Fresh(message) {return {'freshbehavior': '2fresh', 'reset': true};}
    function call1Fresh(message) {return {'freshbehavior': '1fresh', 'reset': true};}
    function callWithReset(message) {return {'freshbehavior': 'withreset', 'reset': true};}

    let attributeCases = [
        {'attribute': '2fresh', 'call': call2Fresh},
        {'attribute': '1fresh', 'call': call1Fresh},
        {'attribute': 'withreset', 'call': callWithReset}
    ]

    async function setAttribute(message, attribute) {
        let setObject = {};
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
        let invertAttr = false
        let skip = 0
        for ([indexArg, attribute] of args.entries()) {
            if (skip > 0) {
                skip -= 1;
                continue;
            }

            if (!helper.canSetConfig(attribute, list[message.author.id]['lists'][listName]['type'])) {
                await helper.sendBotMessage(message, "Attribute '" + attribute + "' is not available for this list");
                return;
            }
            
            skip = await setAttribute(message, attribute);
            if (skip == -1) {
                return;
            }
        }

        if (!ignoreMessage) {
            await helper.sendUserList(message, list, true, client);
        }
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
	description: 'Set one or many attribute(s) for one of your list\ntype ``' + prefix + 'helpconfig [attribute]`` for more help eg. ``' + prefix + 'helpconfig withReset``',
    example: '``' + prefix + 'setconfig 2fresh``\n\n' +
            '**List of available attributes**\n' +
            helper.generateSetConfigExample() + '\n',
    additionalInfo: '',
	async execute(message, args, client) {
		await setConfig(message, args, client);
	}
}