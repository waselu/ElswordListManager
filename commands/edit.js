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
                .setStyle((charDef['stone'] === 'red') ? 'green' : 'grey')
                .setID('red'),
            new disbut.MessageButton()
                .setEmoji(helper.findEmojiIDByAttributeName('blue'))
                .setStyle((charDef['stone'] === 'blue') ? 'green' : 'grey')
                .setID('blue'),
            new disbut.MessageButton()
                .setEmoji(helper.findEmojiIDByAttributeName('yellow'))
                .setStyle((charDef['stone'] === 'yellow') ? 'green' : 'grey')
                .setID('yellow'),
            new disbut.MessageButton()
                .setEmoji(helper.findEmojiIDByAttributeName('giant'))
                .setStyle((charDef['stone'] === 'giant') ? 'green' : 'grey')
                .setID('giant')
        ];
    }
    function displayHeroicDaily(charDef) {
        return [
            new disbut.MessageButton()
                .setEmoji('➕')
                .setLabel('daily')
                .setStyle('green')
                .setID('heroicdailyplus'),
            new disbut.MessageButton()
                .setEmoji('➖')
                .setLabel('daily')
                .setStyle('red')
                .setID('heroicdailyminus')
        ];
    }
    function displayHeroicWeekly(charDef) {
        return [
            new disbut.MessageButton()
                .setEmoji('➕')
                .setLabel('weekly')
                .setStyle('green')
                .setID('heroicweeklyplus'),
            new disbut.MessageButton()
                .setEmoji('➖')
                .setLabel('weekly')
                .setStyle('red')
                .setID('heroicweeklyminus')
        ];
    }
    function displayRigomorDaily(charDef) {
        return [
            new disbut.MessageButton()
                .setEmoji('➕')
                .setLabel('daily')
                .setStyle('green')
                .setID('rigomordailyplus'),
            new disbut.MessageButton()
                .setEmoji('➖')
                .setLabel('daily')
                .setStyle('red')
                .setID('rigomordailyminus')
        ];
    }
    function displayRigomorWeekly(charDef) {
        return [
            new disbut.MessageButton()
                .setEmoji('➕')
                .setLabel('weekly')
                .setStyle('green')
                .setID('rigomorweeklyplus'),
            new disbut.MessageButton()
                .setEmoji('➖')
                .setLabel('weekly')
                .setStyle('red')
                .setID('rigomorweeklyminus')
        ];
    }
    function displayAlias(charDef) { return null; };

    let specialDisplayCases = {
        'stone': displayStone,
        'heroicdaily': displayHeroicDaily,
        'heroicweekly': displayHeroicWeekly,
        'rigomordaily': displayRigomorDaily,
        'rigomorweekly': displayRigomorWeekly,
        'alias': displayAlias
    };
    let specialEditCases = {};

    async function classFound(message, index, realName) {
        let charDef = list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index];

        let rowArray = [];
        let rowNumber = 0;
        let buttonNumber = 0;

        for (attribute of attributes) {
            if (helper.isDefaultAttribute(attribute.name, list[message.author.id]['lists'][list[message.author.id]['active']]['type'])) {                
                if (specialDisplayCases[attribute.name]) {
                    let buttons = specialDisplayCases[attribute.name](charDef);
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
                    let emojiID = helper.findEmojiIDByAttributeName(attribute.name);
                    if (buttonNumber === 5 || (rowNumber === 0 &&  buttonNumber === 0)) {
                        rowArray.push(new disbut.MessageActionRow());
                        buttonNumber = 0;
                        rowNumber += 1;
                    }
                    let button = new disbut.MessageButton()
                        .setStyle(charDef[attribute.name] ? 'green' : 'grey')
                        .setID(attribute.name);
                    if (emojiID || attribute.emoji) {
                        button.setEmoji(emojiID || attribute.emoji);
                    } else {
                        button.setLabel(attribute.name);
                    }
                    rowArray[rowNumber - 1].addComponent(button);
                    buttonNumber = buttonNumber + 1;
                }
            }
        }

        let embed = new MessageEmbed()
            .setTitle('Editing character ' + className + ' on list ' + list[message.author.id]['active'])
            .addField('List:', helper.userListToEmojiList(message.author.id));

        let charTitle = className + ':';
        let charContent = helper.charDefToEmojiList(charDef);

        switch (list[message.author.id]['lists'][list[message.author.id]['active']]['type']) {
            case 'rosso':
                embed.addField('Raid server list:', '```' + helper.userListToEmojiList(message.author.id, false) + '```');
                break;
            case 'heroic':
                charContent += '\n' + 'Dailies: ' + list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]['heroicdaily'];
                charContent += '\n' + 'Weeklies ' + list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]['heroicweekly'];
                break;
            case 'rigomor':
                charContent += '\n' + 'Dailies: ' + list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]['rigomordaily'];
                charContent += '\n' + 'Weeklies ' + list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]['rigomorweekly'];
                break;
            default:
                break;
        }

        embed.addField(charTitle, charContent);

        embedAndButtons['embed'] = embed;
        embedAndButtons['buttons'] = rowArray;
    }

    async function classNotFound(message, realName) {
        await helper.sendBotMessage(message, realName + " was not found in your list");
        embedAndButtons = null;
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, "You have no list yet");
        embedAndButtons = null;
    }

    await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);
    
    return embedAndButtons;
}

async function editAttribute(message, className, attribute, invert) {
    let list = saveManager.getList();

    function callFresh(invert, classDef) { return invert ? {'fresh': false} : {'fresh': true, 'reset': false}; };
    function callReset(invert, classDef) { return !invert ? {'reset': true, 'fresh': false} : {'reset': false}; };
    function callStone(invert, stoneColor) { return invert ? {'stone': null} : {'stone': stoneColor}; };
    function callStoneRed(invert, classDef) { return callStone(invert, 'red'); };
    function callStoneBlue(invert, classDef) { return callStone(invert, 'blue'); };
    function callStoneYellow(invert, classDef) { return callStone(invert, 'yellow'); };
    function callStoneGiant(invert, classDef) { return callStone(invert, 'giant'); };
    function callHeroicdailyplus(invert, classDef) { return classDef['heroicdaily'] < 3 ? {'heroicdaily': classDef['heroicdaily'] + 1} : {}; };
    function callHeroicdailyminus(invert, classDef) { return classDef['heroicdaily'] > 0 ? {'heroicdaily': classDef['heroicdaily'] - 1} : {}; };
    function callHeroicweeklyplus(invert, classDef) { return classDef['heroicweekly'] < 10 ? {'heroicweekly': classDef['heroicweekly'] + 1} : {}; };
    function callHeroicweeklyminus(invert, classDef) { return classDef['heroicweekly'] > 0 ? {'heroicweekly': classDef['heroicweekly'] - 1} : {}; };
    function callRigomorDailyPlus(invert, classDef) { return classDef['rigomordaily'] < 5 ? {'rigomordaily': classDef['rigomordaily'] + 1} : {}; };
    function callRigomorDailyMinus(invert, classDef) { return classDef['rigomordaily'] > 0 ? {'rigomordaily': classDef['rigomordaily'] - 1} : {}; };
    function callRigomorWeeklyPlus(invert, classDef) { return classDef['rigomorweekly'] < 15 ? {'rigomorweekly': classDef['rigomorweekly'] + 1} : {}; };
    function callRigomorWeeklyMinus(invert, classDef) { return classDef['rigomorweekly'] > 0 ? {'rigomorweekly': classDef['rigomorweekly'] - 1} : {}; };

    let attributeCases = {
        fresh: callFresh,
        reset: callReset,
        red: callStoneRed,
        blue: callStoneBlue,
        yellow: callStoneYellow,
        giant: callStoneGiant,
        heroicdailyplus: callHeroicdailyplus,
        heroicdailyminus: callHeroicdailyminus,
        heroicweeklyplus: callHeroicweeklyplus,
        heroicweeklyminus: callHeroicweeklyminus,
        rigomordailyplus: callRigomorDailyPlus,
        rigomordailyminus: callRigomorDailyMinus,
        rigomorweeklyplus: callRigomorWeeklyPlus,
        rigomorweeklyminus: callRigomorWeeklyMinus
    };

    async function classFound(message, index, realName) {
        if (attributeCases[attribute]) {
            let setObject = attributeCases[attribute](invert, list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]);
            for (attributeName in setObject) {
                list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index][attributeName] = setObject[attributeName];
            }
        } else {
            list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index][attribute] = !invert;
        }
        saveManager.setList(list);
    }

    async function classNotFound(message, realName) {
        await helper.sendBotMessage(message, realName + " was not found in your list");
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfClassFoundInUserList(message, className, classFound, classNotFound, userNotFound);
}

async function createMessageAndCollector(message, className, m = null) {
    let embedAndButtons = await getEmbedAndButtons(message, className);

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
        await editAttribute(message, className, button.id, invert);
        collector.stop();
    });

    collector.on('end', async function() {
        if (collector.collected.first()) {
            createMessageAndCollector(message, className, m);
        } else {
            m.delete();
        }
    });
}

async function edit(message, args, client) {
    createMessageAndCollector(message, args[0]);
}

module.exports = {
	name: 'edit',
    nbArgsMin: 1,
    nbArgsMax: 1,
    helpGroup: 'Characters',
	description: 'Edit one of your character',
    example: '``' + prefix + 'edit MP``',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await edit(message, args, client);
	}
}