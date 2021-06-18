
const { MessageEmbed } = require('discord.js');
const { prefix } = require('../config.json');
const cookieSaveManager = require('../utils/cookieSaveManager');
const disbut = require('discord-buttons');

function getCookie(message, userCookie) {
    let embed = new MessageEmbed()
        .setTitle(userCookie['cookie'] + ' cookies')
        .setDescription(userCookie['cps'] + ' cookies per second');
        //.setImage('https://assets.stickpng.com/images/580b57fbd9996e24bc43c0fc.png');

    let cookieButton = new disbut.MessageButton()
        .setLabel('click')
        .setStyle('grey')
        .setID('click');

    let row = new disbut.MessageActionRow()
        .addComponent(cookieButton);

    let rowArray = [
        row
    ]

    return {'embed': embed, 'buttons': rowArray};
}

async function cookie(message, m = null) {
    let userCookie = cookieSaveManager.getUserCookieSave(message.author.id);
    if (!userCookie) {
        userCookie = {
            'cookie': 0,
            'cps': 0,
            'cpsMultiplier': 1,
            'click': 10,
            'clickMultiplier': 1,
            'clickCpsBoost': 0
        }
        cookieSaveManager.setUserCookieSave(message.author.id, userCookie);
    }
    let embedAndButtons = getCookie(message, userCookie);

    if (m) {
        await m.edit('', { components: embedAndButtons['buttons'], embed: embedAndButtons['embed'] });
    } else {
        var m = await message.channel.send('', { components: embedAndButtons['buttons'], embed: embedAndButtons['embed'] });
    }

    const filter = (button) => button.clicker.user.id === message.author.id;
    const collector = m.createButtonCollector(filter);

    collector.on('collect', async function (button) {
        await button.defer();
        if (!(JSON.stringify(userCookie) === JSON.stringify(cookieSaveManager.getUserCookieSave(message.author.id)))) {
            await m.edit(new MessageEmbed().setTitle('__***This game instance is too old***__'))
            return;
        }
        userCookie['cookie'] += (userCookie['click'] + userCookie['clickCpsBoost'] * (userCookie['cps'] * userCookie['cpsMultiplier'])) * userCookie['clickMultiplier'];
        cookieSaveManager.setUserCookieSave(message.author.id, userCookie);
        collector.stop();
    });

    collector.on('end', async function() {
        if (collector.collected.first()) {
            cookie(message, m);
        }
    });
}

module.exports = {
	name: 'cookie',
    nbArgsMin: 0,
    nbArgsMax: 0,
    helpGroup: 'lol',
	description: 'Start Cookie-clicker',
    example: '``' + prefix + 'cookie``',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await cookie(message);
	}
}