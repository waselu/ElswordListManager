
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
    function displayAlias(charDef) { return null; };

    let specialDisplayCases = {
        'fresh': displayFresh,
        'stone': displayStone,
        
        'alias': displayAlias
    };

    function addEditionRow(attribute, singularLabel, pluralLabel) {
        specialDisplayCases[attribute] = function(charDef) {
            return {'buttons': [
                new disbut.MessageButton().setEmoji('➕').setLabel(singularLabel).setStyle('green').setID(attribute + 'plus'),
                new disbut.MessageButton().setEmoji('➖').setLabel(singularLabel).setStyle('red').setID(attribute + 'minus'),
                new disbut.MessageButton().setLabel('Max ' + pluralLabel).setStyle('grey').setID(attribute + 'max'),
                new disbut.MessageButton().setLabel('0 ' + pluralLabel).setStyle('grey').setID(attribute + 'zero')
            ], 'newline': true};
        }
    }

    let dailies = ['daily', 'dailies'];
    let weeklies = ['weekly', 'weeklies'];

    addEditionRow('heroicdaily', ...dailies);
    addEditionRow('heroicweekly', ...weeklies);
    addEditionRow('rigomordaily', ...dailies);
    addEditionRow('rigomorweekly', ...weeklies);
    addEditionRow('sddaily', ...dailies);
    addEditionRow('sdweekly', ...weeklies);

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
            case 'sd':
                charContent += '\n' + 'Dailies: ' + list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]['sddaily'];
                charContent += '\n' + 'Weeklies ' + list[message.author.id]['lists'][list[message.author.id]['active']]['list'][index]['sdweekly'];
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

async function createCharacterButtons(message, selectedClass, currentPanel) {
    let list = saveManager.getList();
    let activeUserList = list[message.author.id]['lists'][list[message.author.id]['active']]['list'];

    let rowArray = [];
    rowArray.push(new disbut.MessageActionRow());

    let startIndex = 5 * currentPanel;
    let endIndex = 5 * (currentPanel + 1);

    while (startIndex < endIndex) {
        if (startIndex === activeUserList.length) {
            break;
        }
        let charDef = activeUserList[startIndex];
        let label = charDef['alias'] || charDef['className'];

        let button = new disbut.MessageButton()
            .setEmoji(helper.findEmojiIDByClassName(charDef['className']))
            .setStyle((label.toLowerCase() === selectedClass.toLowerCase()) ? 'green' : 'grey')
            .setID('character_' + label);

        if (label !== charDef['className']) {
            button.setLabel(label);
        }

        rowArray[0].addComponent(button);
        startIndex += 1;
    }

    async function classFound(message, index, realName) {
        let leftButton = new disbut.MessageButton()
            .setEmoji('⬅️')
            .setLabel('Previous characters')
            .setStyle('grey')
            .setID('changepanelminus');
        if (currentPanel === 0) {
            leftButton.setDisabled();
        }
        let rightButton = new disbut.MessageButton()
            .setEmoji('➡️')
            .setLabel('Next characters')
            .setStyle('grey')
            .setID('changepanelplus');
        if (startIndex !== endIndex) {
            rightButton.setDisabled();
        }
        if (activeUserList.length > 5) {
            rowArray.push(new disbut.MessageActionRow());
            rowArray[1].addComponent(leftButton);
            rowArray[1].addComponent(rightButton);
        }
    }

    async function classNotFound(message, realName) {
        await helper.sendBotMessage(message, realName + " was not found in your list");
    }

    async function userNotFound(message, realName) {
        await helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfClassFoundInUserList(message, selectedClass, classFound, classNotFound, userNotFound);

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

    let attributeCases = {
        fresh: callFresh,
        reset: callReset,
        red: callStoneRed,
        blue: callStoneBlue,
        yellow: callStoneYellow,
        giant: callStoneGiant
    };

    function addRowHandleFunctions(attribute, maxValue) {
        attributeCases[attribute + 'plus'] = function(invert, classDef) { let setObj = {}; setObj[attribute] = classDef[attribute] + 1; return classDef[attribute] < maxValue ? setObj : {}; };;
        attributeCases[attribute + 'minus'] = function(invert, classDef) { let setObj = {}; setObj[attribute] = classDef[attribute] - 1; return classDef[attribute] > 0 ? setObj : {}; };;
        attributeCases[attribute + 'max'] = function(invert, classDef) { let setObj = {}; setObj[attribute] = maxValue; return setObj };;
        attributeCases[attribute + 'zero'] = function(invert, classDef) { let setObj = {}; setObj[attribute] = 0; return setObj };;
    }

    addRowHandleFunctions('heroicdaily', 3);
    addRowHandleFunctions('heroicweekly', 10);
    addRowHandleFunctions('rigomordaily', 5);
    addRowHandleFunctions('rigomorweekly', 15);
    addRowHandleFunctions('sddaily', 2);
    addRowHandleFunctions('sdweekly', 5);

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

async function createMessageAndCollector(message, selectedClass = null, m = null, currentPanel = 0) {
    let list = JSON.parse(JSON.stringify(saveManager.getList()));
    if (!selectedClass) {
        let activeUserList = list[message.author.id]['lists'][list[message.author.id]['active']]['list'];
        if (activeUserList.length === 0) {
            helper.sendBotMessage(message, 'You cannot edit an empty list');
            return;
        }
        selectedClass = activeUserList[0]['className'];
    }

    let embedAndButtons = await getEmbedAndButtons(message, selectedClass);
    let charButtons = await createCharacterButtons(message, selectedClass, currentPanel);

    if (m) {
        await m.edit('', { components: [...charButtons, ...embedAndButtons['buttons']], embed: embedAndButtons['embed'] });
    } else {
        var m = await message.channel.send('', { components: [...charButtons, ...embedAndButtons['buttons']], embed: embedAndButtons['embed'] });
    }
    const filter = (button) => button.clicker.user.id === message.author.id;
    const collector = m.createButtonCollector(filter, {time: 300000});

    collector.on('collect', async function (button) {
        await button.defer();
        if (!(JSON.stringify(list) === JSON.stringify(saveManager.getList()))) {
            await m.edit(new MessageEmbed().setTitle('__***Your list changed, you cannot use this anymore***__'))
            return;
        }
        if (button.id.startsWith('character_')) {
            selectedClass = button.id.replace('character_','');
        } else if (button.id.startsWith('changepanel')) {
            let move = button.id.replace('changepanel','');
            if (move === 'minus') {
                currentPanel -= 1;
            } else if (move === 'plus') {
                currentPanel += 1;
            }
        } else {
            let invert = embedAndButtons['buttons'].map(function(row) {return row.components;}).flat().filter(b => b.custom_id === button.id)[0].style === 3;
            await editAttribute(message, selectedClass, button.id, invert);
        }
        collector.stop();
    });

    collector.on('end', async function() {
        if (collector.collected.first()) {
            createMessageAndCollector(message, selectedClass, m, currentPanel);
        } else {
            await m.edit(new MessageEmbed().setTitle('__***Timed out***__'))
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
	description: 'Edit your current list',
    example: '``' + prefix + 'edit``',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await edit(message, args, client);
	}
}