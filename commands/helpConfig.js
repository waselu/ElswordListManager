
const helper = require('../utils/listHelper');
const { prefix, configurations } = require('../config.json');

async function helpConfig(message, args, client) {
    if (!helper.canSetConfig(args[0])) {
        await helper.sendBotMessage(message, 'Configuration ' + args[0] + ' doesn\'t exist');
        return;
    }

    let config = {};
    for (configuration of configurations) {
        if (configuration.name == args[0]) {
            config = configuration;
        }
    }

    let resetStr = config['reset'] ? 'Calling this configuration will reset your list\n' : '';

    await helper.sendBasicBotEmbed(message, 'Configuration: ' + args[0], config['help'] || 'No help provided for this configuration', resetStr + 'Available lists: ' + config['canSet'].join(', '));
}

module.exports = {
	name: 'helpconfig',
    nbArgsMin: 1,
    nbArgsMax: 1,
	helpGroup: 'Misc.',
	description: 'Show the help for a specific configuration',  
	example: '``' + prefix + 'helpconfig 2fresh``',
	additionalInfo: '',
	async execute(message, args, trueArgs, client) {
		await helpConfig(message, args, client);
	}
}