
const Discord = require('discord.js');
const fs = require('fs');
const { prefix } = require('./config.json');
const saveManager = require('./utils/saveManager');
const helper = require('./utils/listHelper');
const commandManager = require('./utils/commandManager');

const client = new Discord.Client();

//Usable by other users
//TODO: help command
//TODO: sort (autosort) command

//Mandatory

//LONG TERM
//TODO: set/addlist command (example: setlist cl sage reset ke dps tw yellow)

//Propreté du code
//TODO: rework set array

//Commands
client.commands = new Discord.Collection();

const commandAliases = {
	
}

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

for (let [alias, commandName] of Object.entries(commandAliases)) {
	client.commands.set(alias, client.commands.get(commandName))
}

//Listeners
client.on('ready', function() {
	console.log(`logged in as ${client.user.tag}`);
	saveManager.getList(true);
});

client.on('message', function(message) {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	message.delete({timeout: 1000});
	commandManager.commandManager(command, message, args, client);
})

//Bot login
client.login('ODI4Njc5OTQ2MDcwMjYxODIx.YGtGVw.5isgxBCdahm5poWSqBBy6ck8PMo');