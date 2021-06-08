
const { prefix, attributes } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');
const disbut = require('discord-buttons');

async function getEmbedAndButtons(message, selectedClass) {
    let list = saveManager.getList();
    let embedAndButtons = {embed: null, buttons: null};

    function displayStone(charDef) {
        return {'buttons': [
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
        ], 'newline': true};
    }
    function displayFresh(charDef) {
        return {'buttons': [
            new disbut.MessageButton()
                .setEmoji(helper.findEmojiIDByAttributeName('fresh'))
                .setStyle(charDef['fresh'] ? 'green' : 'grey')
                .setID('fresh')
        ], 'newline': true};
    }
    function displayHeroicDaily(charDef) {
        return {'buttons': [
            new disbut.MessageButton()
                .setEmoji('➕')
                .setLabel('daily')
                .setStyle('green')
                .setID('heroicdailyplus'),
            new disbut.MessageButton()
                .setEmoji('➖')
                .setLabel('daily')
                .setStyle('red')
                .setID('heroicdailyminus'),
            new disbut.MessageButton()
                .setLabel('Max dailies')
                .setStyle('grey')
                .setID('heroicdailymax'),
            new disbut.MessageButton()
                .setLabel('0 dailies')
                .setStyle('grey')
                .setID('heroicdailyzero')
        ], 'newline': true};
    }
    function displayHeroicWeekly(charDef) {
        return {'buttons': [
            new disbut.MessageButton()
                .setEmoji('➕')
                .setLabel('weekly')
                .setStyle('green')
                .setID('heroicweeklyplus'),
            new disbut.MessageButton()
                .setEmoji('➖')
                .setLabel('weekly')
                .setStyle('red')
                .setID('heroicweeklyminus'),
            new disbut.MessageButton()
                .setLabel('Max weeklies')
                .setStyle('grey')
                .setID('heroicweeklymax'),
            new disbut.MessageButton()
                .setLabel('0 weeklies')
                .setStyle('grey')
                .setID('heroicweeklyzero')
        ], 'newline': true};
    }
    function displayRigomorDaily(charDef) {
        return {'buttons': [
            new disbut.MessageButton()
                .setEmoji('➕')
                .setLabel('daily')
                .setStyle('green')
                .setID('rigomordailyplus'),
            new disbut.MessageButton()
                .setEmoji('➖')
                .setLabel('daily')
                .setStyle('red')
                .setID('rigomordailyminus'),
            new disbut.MessageButton()
                .setLabel('Max dailies')
                .setStyle('grey')
                .setID('rigomordailymax'),
            new disbut.MessageButton()
                .setLabel('0 dailies')
                .setStyle('grey')
                .setID('rigomordailyzero')
        ], 'newline': true};
    }
    function displayRigomorWeekly(charDef) {
        return {'buttons': [
            new disbut.MessageButton()
                .setEmoji('➕')
                .setLabel('weekly')
                .setStyle('green')
                .setID('rigomorweeklyplus'),
            new disbut.MessageButton()
                .setEmoji('➖')
                .setLabel('weekly')
                .setStyle('red')
                .setID('rigomorweeklyminus'),
            new disbut.MessageButton()
                .setLabel('Max weeklies')
                .setStyle('grey')
                .setID('rigomorweeklymax'),
            new disbut.MessageButton()
                .setLabel('0 weeklies')
                .setStyle('grey')
                .setID('rigomorweeklyzero')
        ], 'newline': true};
    }
    function displayAlias(charDef) { return null; };

    let specialDisplayCases = {
        'fresh': displayFresh,
        'stone': displayStone,

        'heroicdaily': displayHeroicDaily,
        'heroicweekly': displayHeroicWeekly,

        'rigomordaily': displayRigomorDaily,
        'rigomorweekly': displayRigomorWeekly,
        
        'alias': displayAlias
    };

    async function classFound(message, index, realName) {
        let charDef = list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index];

        let rowArray = [];
        let rowNumber = 0;
        let buttonNumber = 0;

        for (attribute of attributes) {
            if (helper.isDefaultAttribute(attribute.name, list[message.author.id]['lists'][list[message.author.id]['active']]['type'])) {                
                if (specialDisplayCases[attribute.name]) {
                    let buttons = specialDisplayCases[attribute.name](charDef);
                    if (!buttons || !buttons.buttons) {
                        continue;
                    }
                    if (buttons.newline && buttonNumber !== 0) {
                        rowArray.push(new disbut.MessageActionRow());
                        buttonNumber = 0;
                        rowNumber += 1;
                    }
                    for (button of buttons.buttons) {
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
            .setTitle('Editing character ' + selectedClass + ' on list ' + list[message.author.id]['active'])
            .addField('List:', helper.userListToEmojiList(message.author.id));

        let charTitle = selectedClass + ':';
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

    await helper.doIfClassFoundInUserList(message, selectedClass, classFound, classNotFound, userNotFound);
    
    return embedAndButtons;
}

async function createCharacterButtons(message, selectedClass) {
    let list = saveManager.getList();
    let activeUserList = list[message.author.id]['lists'][list[message.author.id]['active']]['list'];

    let rowArray = [];
    let rowNumber = 0;
    let buttonNumber = 0;
    for (charDef of activeUserList) {
        if (buttonNumber === 5 || (rowNumber === 0 &&  buttonNumber === 0)) {
            rowArray.push(new disbut.MessageActionRow());
            buttonNumber = 0;
            rowNumber += 1;
        }

        let label = charDef['alias'] || charDef['className'];

        let button = new disbut.MessageButton()
            .setEmoji(helper.findEmojiIDByClassName(charDef['className']))
            .setStyle((label.toLowerCase() === selectedClass.toLowerCase()) ? 'green' : 'grey')
            .setID('character_' + label);

        if (label !== charDef['className']) {
            button.setLabel(label);
        }

        rowArray[rowNumber - 1].addComponent(button);

        buttonNumber += 1;
    }

    return rowArray;
}

async function editAttribute(message, selectedClass, attribute, invert) {
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
    function callHeroicdailymax(invert, classDef) { return {'heroicdaily': 3} };
    function callHeroicdailyzero(invert, classDef) { return {'heroicdaily': 0} };
    function callHeroicweeklyplus(invert, classDef) { return classDef['heroicweekly'] < 10 ? {'heroicweekly': classDef['heroicweekly'] + 1} : {}; };
    function callHeroicweeklyminus(invert, classDef) { return classDef['heroicweekly'] > 0 ? {'heroicweekly': classDef['heroicweekly'] - 1} : {}; };
    function callHeroicweeklymax(invert, classDef) { return {'heroicweekly': 10} };
    function callHeroicweeklyzero(invert, classDef) { return {'heroicweekly': 0} };
    function callRigomorDailyPlus(invert, classDef) { return classDef['rigomordaily'] < 5 ? {'rigomordaily': classDef['rigomordaily'] + 1} : {}; };
    function callRigomorDailyMinus(invert, classDef) { return classDef['rigomordaily'] > 0 ? {'rigomordaily': classDef['rigomordaily'] - 1} : {}; };
    function callRigomordailymax(invert, classDef) { return {'rigomordaily': 3} };
    function callRigomordailyzero(invert, classDef) { return {'rigomordaily': 0} };
    function callRigomorWeeklyPlus(invert, classDef) { return classDef['rigomorweekly'] < 15 ? {'rigomorweekly': classDef['rigomorweekly'] + 1} : {}; };
    function callRigomorWeeklyMinus(invert, classDef) { return classDef['rigomorweekly'] > 0 ? {'rigomorweekly': classDef['rigomorweekly'] - 1} : {}; };
    function callRigomorweeklymax(invert, classDef) { return {'rigomorweekly': 15} };
    function callRigomorweeklyzero(invert, classDef) { return {'rigomorweekly': 0} };

    let attributeCases = {
        fresh: callFresh,
        reset: callReset,
        red: callStoneRed,
        blue: callStoneBlue,
        yellow: callStoneYellow,
        giant: callStoneGiant,

        heroicdailyplus: callHeroicdailyplus,
        heroicdailyminus: callHeroicdailyminus,
        heroicdailymax: callHeroicdailymax,
        heroicdailyzero: callHeroicdailyzero,
        heroicweeklyplus: callHeroicweeklyplus,
        heroicweeklyminus: callHeroicweeklyminus,
        heroicweeklymax: callHeroicweeklymax,
        heroicweeklyzero: callHeroicweeklyzero,

        rigomordailyplus: callRigomorDailyPlus,
        rigomordailyminus: callRigomorDailyMinus,
        rigomordailymax: callRigomordailymax,
        rigomordailyzero: callRigomordailyzero,
        rigomorweeklyplus: callRigomorWeeklyPlus,
        rigomorweeklyminus: callRigomorWeeklyMinus,
        rigomorweeklymax: callRigomorweeklymax,
        rigomorweeklyzero: callRigomorweeklyzero
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

    await helper.doIfClassFoundInUserList(message, selectedClass, classFound, classNotFound, userNotFound);
}

async function createMessageAndCollector(message, selectedClass = null, m = null) {
    if (!selectedClass) {
        let list = saveManager.getList();
        let activeUserList = list[message.author.id]['lists'][list[message.author.id]['active']]['list'];
        if (activeUserList.length === 0) {
            helper.sendBotMessage(message, 'You cannot edit an empty list');
            return;
        }
        selectedClass = activeUserList[0]['className'];
    }

    let embedAndButtons = await getEmbedAndButtons(message, selectedClass);

    if (!embedAndButtons) {
        return;
    }

    let charButtons = await createCharacterButtons(message, selectedClass);

    if (m) {
        await m.edit('', { components: [...charButtons, ...embedAndButtons['buttons']], embed: embedAndButtons['embed'] });
    } else {
        var m = await message.channel.send('', { components: [...charButtons, ...embedAndButtons['buttons']], embed: embedAndButtons['embed'] });
    }
    const filter = (button) => button.clicker.user.id === message.author.id;
    const collector = m.createButtonCollector(filter, {time: 60000});

    collector.on('collect', async function (button) {
        await button.defer();
        if (button.id.startsWith('character_')) {
            selectedClass = button.id.replace('character_','');
            collector.stop();
            return;
        }
        let invert = embedAndButtons['buttons'].map(function(row) {return row.components;}).flat().filter(b => b.custom_id === button.id)[0].style === 3;
        await editAttribute(message, selectedClass, button.id, invert);
        collector.stop();
    });

    collector.on('end', async function() {
        if (collector.collected.first()) {
            createMessageAndCollector(message, selectedClass, m);
        } else {
            m.delete();
        }
    });
}

async function edit(message, args, client) {
    let list = saveManager.getList();
    let activeList = list[message.author.id]['active'];

    async function listFound() {
        createMessageAndCollector(message);
    }

    async function listNotFound() {
        await helper.sendBotMessage(message, 'Your active list was not found, please contact Waselu#8834');
    }

    async function userNotFound() {
        await helper.sendBotMessage(message, 'You have no list yet');
    }

    helper.doIfListFoundInUserList(message, activeList, listFound, listNotFound, userNotFound);
}

module.exports = {
	name: 'edit',
    nbArgsMin: 0,
    nbArgsMax: 0,
    helpGroup: 'Characters',
	description: 'Edit one of your character',
    example: '``' + prefix + 'edit MP``',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await edit(message, args, client);
	}
}