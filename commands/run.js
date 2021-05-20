
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function run(message, args) {
    let list = saveManager.getList();

    async function classFound(message, index, realName) {
        switch (list[message.author.username]['lists'][list[message.author.username]['active']]['type']) {
            case 'rosso':
                if (!list[message.author.username]['lists'][list[message.author.username]['active']]['list'][index]["fresh"]) {
                    if (list[message.author.username]['lists'][list[message.author.username]['active']]['list'][index]["reset"]) {
                        list[message.author.username]['lists'][list[message.author.username]['active']]['list'][index]["reset"] = false;
                    } else {
                        await helper.sendBotMessage(message, realName + " is not fresh nor has a reset");
                    }
                } else {
                    list[message.author.username]['lists'][list[message.author.username]['active']]['list'][index]["fresh"] = false;
                    list[message.author.username]['lists'][list[message.author.username]['active']]['list'][index]["reset"] = true;
                }
                break;
            case 'henir':
                if (!list[message.author.username]['lists'][list[message.author.username]['active']]['list'][index]["henirnormal"]) {
                    if (list[message.author.username]['lists'][list[message.author.username]['active']]['list'][index]["henirchallenge"]) {
                        list[message.author.username]['lists'][list[message.author.username]['active']]['list'][index]["henirchallenge"] = false;
                    } else {
                        await helper.sendBotMessage(message, realName + " has fully cleared henir already");
                    }
                } else {
                    list[message.author.username]['lists'][list[message.author.username]['active']]['list'][index]["henirnormal"] = false;
                }
                break;
            default:
                break;
        }
    }

    async function classNotFound(message, realName) {
        await helper.sendBotMessage(message, realName + " was not found in your list");
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, "You have no list yet");
    }

    for (className of args) {
        await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);
    }

    await helper.sendUserList(message, list);
}

module.exports = {
	name: 'run',
    argNumber: '>0',
    helpGroup: 'Characters',
	description: 'Run dungeon on a specific char, depends on the list\'s type',
    example: '``' + prefix + 'run NP``\n' +
        '``' + prefix + 'run CL Devi KE``',
    additionalInfo: 'this command has the same effect as setting "not fresh" on a character',
	async execute(message, args, client) {
		await run(message, args);
	}
}