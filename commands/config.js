const { prefix, configurations } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');
const disbut = require('discord-buttons');

async function getEmbedAndButtons(message) {
    let list = saveManager.getList();
    let listName = list[message.author.id]['active'];
    let embedAndButtons = {embed: null, buttons: null};

    let specialDisplayCases = {

    };

    async function listFound(message) {
        let rowArray = [];
        let rowNumber = 0;
        let buttonNumber = 0;

        for (configuration of configurations) {
            if (helper.isDefaultConfig(configuration.name, list[message.author.id]['lists'][listName]['type'])) {                
                if (specialDisplayCases[configuration.name]) {
                    let buttons = specialDisplayCases[configuration.name]();
                    if (!buttons) {
                        continue;
                    }
                    for (button of buttons) {
                        if (buttonNumber === 5 || (rowNumber === 0 &&  buttonNumber === 0)) {
                            rowArray.push(new disbut.MessageActionRow());
                            buttonNumber = 0;
                            rowNumber += 1;
                        }
                        rowArray[rowNumber - 1].addComponent(button);
                        buttonNumber = buttonNumber + 1;
                    }
                } else {
                    if (buttonNumber === 5 || (rowNumber === 0 &&  buttonNumber === 0)) {
                        rowArray.push(new disbut.MessageActionRow());
                        buttonNumber = 0;
                        rowNumber += 1;
                    }
                    let button = new disbut.MessageButton()
                        .setStyle(list[message.author.id]['lists'][listName]['config'][configuration.name] ? 'green' : 'grey')
                        .setID(configuration.name)
                        .setLabel(configuration.name[0].toUpperCase() + configuration.name.slice(1));
                    rowArray[rowNumber - 1].addComponent(button);
                    buttonNumber = buttonNumber + 1;
                }
            }
        }

        let embed = new MessageEmbed()
            .setTitle('Changing configuration of list "' + listName + '"')
            .addField('List:', helper.userListToEmojiList(message.author.id));

        embedAndButtons['embed'] = embed;
        embedAndButtons['buttons'] = rowArray;
    }

    async function listNotFound(message) {
        await helper.sendBotMessage(message, 'You do not have a list named "' + listName + '"');
        embedAndButtons = null;
    }

    async function userNotFound(message) {
        await helper.sendBotMessage(message, 'You have no list yet');
        embedAndButtons = null;
    }

    await helper.doIfListFoundInUserList(message, listName, listFound, listNotFound, userNotFound);
    
    return embedAndButtons;
}

async function editAttribute(message, attribute, invert) {
    let list = saveManager.getList();
    let listName = list[message.author.id]['active'];

    let attributeCases = {
        
    };

    async function listFound(message) {
        if (attributeCases[attribute]) {
            let setObject = attributeCases[attribute](invert);
            for (attributeName in setObject) {
                list[message.author.id]['lists'][listName]['config'][attributeName] = setObject[attributeName];
            }
        } else {
            list[message.author.id]['lists'][listName]['config'][attribute] = !invert;
        }
        saveManager.setList(list);
    }

    async function listNotFound(message) {
        await helper.sendBotMessage(message, 'You do not have a list named "' + listName + '"');
    }

    async function userNotFound(message) {
        await helper.sendBotMessage(message, 'You have no list yet');
    }

    await helper.doIfListFoundInUserList(message, listName, listFound, listNotFound, userNotFound);
}

async function createMessageAndCollector(message, m = null) {
    let embedAndButtons = await getEmbedAndButtons(message);

    if (!embedAndButtons) {
        return;
    }

    if (m) {
        await m.edit('', { components: embedAndButtons['buttons'], embed: embedAndButtons['embed'] });
    } else {
        var m = await message.channel.send('', { components: embedAndButtons['buttons'], embed: embedAndButtons['embed'] });
    }
    const filter = (button) => button.clicker.user.id === message.author.id;
    const collector = m.createButtonCollector(filter, {time: 60000});

    collector.on('collect', async function (button) {
        await button.defer();
        let invert = embedAndButtons['buttons'].map(function(row) {return row.components;}).flat().filter(b => b.custom_id === button.id)[0].style === 3;
        await editAttribute(message, button.id, invert);
        collector.stop();
    });

    collector.on('end', async function() {
        if (collector.collected.first()) {
            createMessageAndCollector(message, m);
        } else {
            m.delete();
        }
    });
}

async function config(message, args, client) {
    createMessageAndCollector(message);
}

module.exports = {
	name: 'config',
    nbArgsMax: 0,
    helpGroup: 'List',
	description: 'Change the configuration of your current list',
    example: '``' + prefix + 'config``',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await config(message, args, client);
	}
}