
const { prefix } = require('../config.json');
const { MessageEmbed } = require('discord.js');

async function power(message) {
    setTimeout(async function() {
        await message.channel.send('Never gonna give you up!').then(function(m) {})
        setTimeout(async function() {
            await message.channel.send('Never gonna let you down!').then(function(m) {})
            setTimeout(async function() {
                await message.channel.send('Never gonna run around, and desert you!').then(function(m) {})
                setTimeout(async function() {
                    await message.channel.send('Never gonna make you cry!').then(function(m) {})
                    setTimeout(async function() {
                        await message.channel.send('Never gonna say goodbye!').then(function(m) {})
                        setTimeout(async function() {
                            await message.channel.send('Never gonna tell a lie, and hurt you!').then(function(m) {
                                setTimeout(async function() {
                                    await message.channel.send(new MessageEmbed().setImage('https://yt3.ggpht.com/ytc/AAUvwni36SveDisR-vOAmmklBfJxnnjuRG3ihzfrwEfORA=s900-c-k-c0x00ffffff-no-rj'));
                                }, 1000);
                            })
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
    }, 1000);
}

module.exports = {
	name: 'power',
    helpGroup: 'Misc.',
	description: 'It does something cool, wanna try it?',
    example: '``' + prefix + 'power``',
    additionalInfo: '',
	async execute(message, args, trueArgs, client) {
        await power(message);
	}
}