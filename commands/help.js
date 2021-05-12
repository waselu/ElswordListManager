
const { MessageEmbed } = require('discord.js');
const helper = require('../utils/listHelper');
const { prefix, aliases } = require('../config.json');

async function specHelp(message, commandName, client) {
	commandName = commandName.trim().toLowerCase();
	if (!client.commands.has(commandName)) {
		message.channel.send('No command named "' + commandName + '"');
		return;
	}

	let aliasString = '';
	for (let [index, alias] of aliases[commandName].entries()) {
		if (index > 0) {
			aliasString += '\n'
		}
		aliasString += '``' + prefix + alias + '``';
	}

	let command = client.commands.get(commandName);
	let embed = new MessageEmbed()
	.setAuthor('Rosso raid manager', 'https://64.media.tumblr.com/4d56ac1bcd708c38392a6b37f98a68b8/tumblr_pozk3r9eiW1wsn58z_640.jpg')
	.setThumbnail('https://cdn.discordapp.com/attachments/736163626934861845/742671714386968576/help_animated_x4_1.gif')
	.setTitle('Command help -> ' + commandName)
	.setDescription(command.description)
	.addField('Examples', command.example)
	.addField('Aliases', aliasString)
	.setFooter(command.additionalInfo);

	await helper.sendBotMessage(message, embed);
}

async function help(message, args, client) {
	if (args.length === 0) {
		let embed = new MessageEmbed()
		.setAuthor('Rosso raid manager', 'https://64.media.tumblr.com/4d56ac1bcd708c38392a6b37f98a68b8/tumblr_pozk3r9eiW1wsn58z_640.jpg')
		.setThumbnail('https://cdn.discordapp.com/attachments/736163626934861845/742671714386968576/help_animated_x4_1.gif')
		.setTitle('Command help')
		.setDescription('Type ``' + prefix + 'help [command]`` for more help eg. ``' + prefix + 'help add``')
		.addField('Characters', '``add`` ``remove``\n``set`` ``run``\n``move``', true)
		.addField('List', '``list`` ``show``\n``weeklyreset``', true)
		.addField('Misc.', '``help``', true)
		.setFooter('All commands are case insensitive\nUsing any command besides help will copy your list to your clipboard');

	    await helper.sendBotMessage(message, embed);
	} else {
		await specHelp(message, args[0], client);
	}
}

module.exports = {
	name: 'help',
	argNumber: '<2',
	description: 'Display this help',
	example: '``' + prefix + 'help``\n``' + prefix + 'help add``',
	additionalInfo: '',
	async execute(message, args, client) {
		await help(message, args, client);
	}
}