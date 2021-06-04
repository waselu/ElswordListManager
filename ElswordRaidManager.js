
const Discord = require('discord.js');
const fs = require('fs');
const schedule = require('node-schedule');
const { aliases } = require('./config.json');
const saveManager = require('./utils/saveManager');
const helper = require('./utils/listHelper');
const commandManager = require('./utils/commandManager');
require('discord-reply');

const client = new Discord.Client();

require('discord-buttons')(client);

//Mandatory
//Add list types: SD (Later: Berthe)
//Add rigomor emojis, change heroic emojis
//Rework client being passed everywhere, direcly call command via require
//Remove setconfig and helpconfig commands, add editconfig command that behave like the edit command (buttons)
//Add other list behavior to the edit command
//Sort each list independently when autosorting
//Rename newlist to addlist
//Add server emoji list to edit message if type == 'rosso'

//Fixes
//Add JSON.parse(JSON.stringify)

//Things to change when adding a new list type: reset, list, set attributes, [idk]
//Add list type in config, edit attributes, add emojis

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
	saveManager.getList(true);
});

client.on('message', function(message) {
	commandManager.commandManager(message, client);
})

//Auto resets
const jobDaily = schedule.scheduleJob('0 9 * * *', helper.resetDaily);
const jobWeekly = schedule.scheduleJob('0 9 * * 3', helper.resetWeekly);

//Bot login
client.login('ODI4Njc5OTQ2MDcwMjYxODIx.YGtGVw.5isgxBCdahm5poWSqBBy6ck8PMo');