
const Discord = require('discord.js');
const fs = require('fs');
const schedule = require('node-schedule');
const { aliases } = require('./config.json');
const saveManager = require('./utils/saveManager');
const logs = require('./utils/logs');
const helper = require('./utils/listHelper');
const commandManager = require('./utils/commandManager');
require('discord-reply');

const client = new Discord.Client();

require('discord-buttons')(client);

//Mandatory
//Add list types: SD (Later: Berthe)
//Check list integrity on button click
//Remove config command, make autosort default value = true

//Long term
//Clear logs older than 1 month (parse log date)
//Anti-conflict system on logs, 10+ files and array of used files to use an unused one, store time of command to merge afterward
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
	saveManager.getList(true);
	logs.getLogs(true);
});

client.on('message', function(message) {
	commandManager.commandManager(message, client);
})

//Auto resets
const jobDaily = schedule.scheduleJob('0 9 * * *', helper.resetDaily);
const jobWeekly = schedule.scheduleJob('0 9 * * 3', helper.resetWeekly);

//Bot login
client.login('ODI4Njc5OTQ2MDcwMjYxODIx.YGtGVw.5isgxBCdahm5poWSqBBy6ck8PMo');