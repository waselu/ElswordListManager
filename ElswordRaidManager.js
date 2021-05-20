
const Discord = require('discord.js');
const fs = require('fs');
const schedule = require('node-schedule');
const { prefix, aliases } = require('./config.json');
const saveManager = require('./utils/saveManager');
const helper = require('./utils/listHelper');
const commandManager = require('./utils/commandManager');

const client = new Discord.Client();

//Mandatory
//auto sort lists by fresh/daily/weekly
//add list config (nosort, etc...)

//Debug
//Add a function to impersonate another user (impersonate userid)

//Fixes
//Add JSON.parse(JSON.stringify)

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
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	if (!client.commands.has(commandName)) return;

	const command = client.commands.get(commandName);

	if (command.helpGroup == 'Debug' && message.author.id != '204486578482053120') {
		return;
	}

	//message.delete({timeout: 1000});
	commandManager.commandManager(command, message, args, client);
})

//Auto resets
const jobDaily = schedule.scheduleJob('0 9 * * *', helper.resetDaily);
const jobWeekly = schedule.scheduleJob('0 9 * * 3', helper.resetWeekly);

//Bot login
client.login('ODI4Njc5OTQ2MDcwMjYxODIx.YGtGVw.5isgxBCdahm5poWSqBBy6ck8PMo');