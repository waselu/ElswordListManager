const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');
const saveManager = require('../utils/saveManager');
const helper = require('../utils/listHelper');

async function showList(message, args, client) {
    list = saveManager.getList();

    async function userFound(message) {
        messageStr = '';
        let active = list[message.author.username]['active'];

        let embed = new MessageEmbed()
            .setAuthor('Rosso raid manager', 'https://64.media.tumblr.com/4d56ac1bcd708c38392a6b37f98a68b8/tumblr_pozk3r9eiW1wsn58z_640.jpg')
            .setTitle(message.author.username + '\'s lists')
            .setDescription('');
        for (key in list[message.author.username]['lists']) {
            if (messageStr != '') {
                messageStr += '\n\n';
            }
            list[message.author.username]['active'] = key;
            embed.addField('**' + key + ' - ' + list[message.author.username]['lists'][key]['type'] + '**', helper.userListToServerList(message.author.username));
        }

        list[message.author.username]['active'] = active;
        await helper.sendBotMessage(message, embed);
    }

    async function userNotFound(message) {
        await helper.sendBotMessage(message, 'You have no list yet');
    }

    await helper.doIfUserFoundInUserList(message, userFound, userNotFound);
}

module.exports = {
	name: 'showlist',
    argNumber: '0',
    helpGroup: 'List',
	description: 'Show all your created lists',
    example: '``' + prefix + 'showlist``',
    additionalInfo: '',
	async execute(message, args, client) {
		await showList(message, args, client);
	}
}