
const Discord = require('discord.js');
const fs = require('fs');
const { aliases } = require('./config.json');
const cookieSaveManager = require('./utils/cookieSaveManager');
const commandManager = require('./utils/commandManager');
require('discord-reply');

const client = new Discord.Client();

require('discord-buttons')(client);

//Long term
//Clear logs older than 1 month
//Discord slash commands

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

for (let [commandName, commandAliases] of Object.entries(aliases)) {
	for (let alias of commandAliases) {
		client.commands.set(alias, client.commands.get(commandName))
	}
}

//Listeners
client.on('ready', function() {
	console.log(`logged in as ${client.user.tag}`);
	cookieSaveManager.getCookieSave(true);
});

client.on('message', function(message) {
	commandManager.commandManager(message, client);
})

//Bot login
client.login('ODI4Njc5OTQ2MDcwMjYxODIx.YGtGVw.5isgxBCdahm5poWSqBBy6ck8PMo');