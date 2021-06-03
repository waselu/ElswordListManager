
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function show(message, args) {
    let list = saveManager.getList();

    async function userFound(message) {
        let charList = "";
        let userList = list[message.author.id];
        userList = userList['lists'][userList['active']]['list'];
        for ([index, classDef] of userList.entries()) {
            charList += '\n' + helper.charDefToEmojiList(classDef);
            charList += " " + (classDef['alias'] != null ? classDef['alias'] : classDef['className']);
        }

        charList = charList.trim() ? charList : 'No character in this list';
        let embed = new MessageEmbed()
            .setTitle(message.author.username + '\'s list: ' + list[message.author.id]['active'])
            .setAuthor('Rosso raid manager', 'https://64.media.tumblr.com/4d56ac1bcd708c38392a6b37f98a68b8/tumblr_pozk3r9eiW1wsn58z_640.jpg')
            .addField('Your characters:', charList)
            .addField('List:', helper.userListToEmojiList(message.author.id));

        if (list[message.author.id]['lists'][list[message.author.id]['active']]['type'] == 'rosso') {
            embed.addField('**Raid server list**:', '```' + helper.userListToEmojiList(message.author.id, false) + '```')
        }

        await helper.sendBotMessage(message, embed);
    }

    async function userNotFound(message) {
        await helper.sendBotMessage(message, "You have no list yet");
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
}

module.exports = {
	name: 'show',
    nbArgsMin: 0,
    nbArgsMax: 0,
    helpGroup: 'List',
	description: 'Show the state of the selectionned list',
    example: '``' + prefix + 'show``',
    additionalInfo: '',
	async execute(message, args, client) {
		await show(message, args);
	}
}