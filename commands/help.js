
const { MessageEmbed } = require('discord.js');
const helper = require('../utils/listHelper');
const { prefix } = require('../config.json');

function help(message, args, client) {
    let embed = new MessageEmbed()
		.setAuthor('Rosso raid manager', 'https://64.media.tumblr.com/4d56ac1bcd708c38392a6b37f98a68b8/tumblr_pozk3r9eiW1wsn58z_640.jpg')
		.setThumbnail('https://cdn.discordapp.com/attachments/736163626934861845/742671714386968576/help_animated_x4_1.gif')
		.setTitle('Command help')
		.setDescription('Type ``' + prefix + 'help [command]`` for more help eg. ``' + prefix + 'help add``')
		.addField('Characters', '``add`` ``remove``\n``set`` ``run``\n``move``', true)
		.addField('List', '``list`` ``show``\n``weeklyreset``', true)
		.addField('Misc.', '``help``', true);

    helper.sendBotMessage(message, embed);
}

module.exports = {
	name: 'help',
	description: 'Display this help',
	execute(message, args, client) {
		help(message, args, client);
	}
}