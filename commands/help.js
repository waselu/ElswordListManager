
const { MessageEmbed } = require('discord.js');
const helper = require('../utils/listHelper');

function help(message, args, client) {
    let embed = new MessageEmbed()
		.setTitle('Help')
		.setDescription('Command help for ElswordRaidManager bot');
		//.setFooter('Use the :answer command to answer')

    client.commands.forEach(function(value, key) {
        embed.addField(value.name, value.description);
    })
    helper.sendBotMessage(message, embed);
}

module.exports = {
	name: 'help',
	description: 'Display this help',
	execute(message, args, client) {
		help(message, args, client);
	}
}