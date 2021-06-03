const { prefix, attributes } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');
const disbut = require('discord-buttons');

async function getEmbedAndButtons(message, className) {
    let list = saveManager.getList();
    let embedAndButtons = {embed: null, buttons: null};

    function displayStone(charDef) {
        return [
            new disbut.MessageButton()
                .setEmoji(helper.findEmojiIDByAttributeName('red'))
                .setStyle((charDef['stone'] === 'red') ? 'green' : 'red')
                .setID('red'),
            new disbut.MessageButton()
                .setEmoji(helper.findEmojiIDByAttributeName('blue'))
                .setStyle((charDef['stone'] === 'blue') ? 'green' : 'red')
                .setID('blue'),
            new disbut.MessageButton()
                .setEmoji(helper.findEmojiIDByAttributeName('yellow'))
                .setStyle((charDef['stone'] === 'yellow') ? 'green' : 'red')
                .setID('yellow'),
            new disbut.MessageButton()
                .setEmoji(helper.findEmojiIDByAttributeName('giant'))
                .setStyle((charDef['stone'] === 'giant') ? 'green' : 'red')
                .setID('giant')
        ];
    }
    function displayAlias(charDef) { return null; };

    let specialDisplayCases = {
        'stone': displayStone,
        'alias': displayAlias
    };
    let specialEditCases = {};

    async function classFound(message, index, realName) {
        let charDef = list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index];

        let embed = new MessageEmbed()
            .setTitle(helper.charDefToEmojiList(charDef) + (charDef.alias ? charDef.alias : charDef.className));

        let rowArray = [];
        let rowNumber = 0;
        let buttonNumber = 0;

        for (attribute of attributes) {
            if (helper.isDefaultAttribute(attribute.name, list[message.author.id]['lists'][list[message.author.id]['active']]['type'])) {
                if (buttonNumber === 0) {
                    rowArray.push(new disbut.MessageActionRow());
                    rowNumber += 1;
                }
                
                if (specialDisplayCases[attribute.name]) {
                    let buttons = specialDisplayCases[attribute.name](charDef);
                    if (!buttons) {
                        continue;
                    }
                    for (button of buttons) {
                        if (buttonNumber === 0) {
                            rowArray.push(new disbut.MessageActionRow());
                            rowNumber += 1;
                        }
                        rowArray[rowNumber - 1].addComponent(button);
                        buttonNumber = (buttonNumber + 1) % 5;
                    }
                } else {
                    let emojiID = helper.findEmojiIDByAttributeName(attribute.name);
                    let button = new disbut.MessageButton()
                        .setStyle(charDef[attribute.name] ? 'green' : 'red')
                        .setID(attribute.name);
                    if (emojiID || attribute.emoji) {
                        button.setEmoji(emojiID || attribute.emoji);
                    } else {
                        button.setLabel(attribute.name);
                    }
                    rowArray[rowNumber - 1].addComponent(button);
                    buttonNumber = (buttonNumber + 1) % 5;
                }
            }
        }

        embedAndButtons['embed'] = embed;
        embedAndButtons['buttons'] = rowArray;
    }

    async function classNotFound(message, realName) {
        await helper.sendBotMessage(message, realName + " was not found in your list");
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);

    return embedAndButtons;
}

async function editAttribute(message, className, attribute) {

}

async function edit(message, args, client) {
    let embedAndButtons = await getEmbedAndButtons(message, args[0]);

    let m = await message.channel.send('', { components: embedAndButtons['buttons'], embed: embedAndButtons['embed'] });
    const filter = (button) => button.clicker.user.id === message.author.id;
    const collector = m.createButtonCollector(filter);

    collector.on('collect', async function (button) {
        await button.defer();
        console.log(button.id);
        console.log(button.setStyle);
    });
    collector.on('end', function() {
        m.delete();
    });
}

module.exports = {
	name: 'edit',
    nbArgsMin: 1,
    nbArgsMax: 1,
    helpGroup: 'Characters',
	description: 'Edit one of your character',
    example: '``' + prefix + 'edit MP``',
    additionalInfo: '',
	async execute(message, args, client) {
		await edit(message, args, client);
	}
}