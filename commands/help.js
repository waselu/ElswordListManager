
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
	.setFooter(command.additionalInfo);

	if (aliasString != '') {
		embed.addField('Aliases', aliasString)
	}

	await helper.sendBotMessage(message, embed);
}

async function help(message, args, client) {
	if (args.length === 0) {
		let embed = new MessageEmbed()
		.setAuthor('Rosso raid manager', 'https://64.media.tumblr.com/4d56ac1bcd708c38392a6b37f98a68b8/tumblr_pozk3r9eiW1wsn58z_640.jpg')
		.setThumbnail('https://cdn.discordapp.com/attachments/736163626934861845/742671714386968576/help_animated_x4_1.gif')
		.setTitle('Command help')
		.setDescription('Type ``' + prefix + 'help [command]`` for more help eg. ``' + prefix + 'help add``')
		.setFooter('All commands are case insensitive\nUsing any command besides help will copy your list to your clipboard');

		let groups = {};
		for ([key, command] of client.commands.entries()) {
			if (!(key === command.name)) {
				continue;
			}
			if (!groups[command.helpGroup]) {
				groups[command.helpGroup] = [];
			}
			groups[command.helpGroup].push('``' + command.name + '``');
		}
		
		for ([group, commands] of Object.entries(groups)) {
			if (group === 'Debug') {
				continue;
			}
			let groupStr = '';
			for ([index, command] of commands.entries()) {
				groupStr += command + ' ';
				if (index % 2 == 1 && index + 1 != commands.length) {
					groupStr += '\n';
				}
			}
			embed.addField(group, groupStr, true);
		}

	    await helper.sendBotMessage(message, embed);
	} else {
		await specHelp(message, args[0], client);
	}
}

module.exports = {
	name: 'help',
	argNumber: '<2',
	helpGroup: 'Misc.',
	description: 'Display this help',
	example: '``' + prefix + 'help``\n``' + prefix + 'help add``',
	additionalInfo: '',
	async execute(message, args, client) {
		await help(message, args, client);
	}
}