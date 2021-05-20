
const helper = require('../utils/listHelper');
const { prefix, attributes } = require('../config.json');

async function helpAttr(message, args, client) {
    if (!helper.canSetAttribute(args[0])) {
        await helper.sendBotMessage(message, 'Attribute ' + args[0] + ' doesn\'t exist');
        return;
    }

    let attr = {};
    for (attribute of attributes) {
        if (attribute.name == args[0].toLowerCase()) {
            attr = attribute;
        }
    }

    await helper.sendBasicBotEmbed(message, 'Attribute: ' + args[0], attr['help'] || 'No help provided for this attribute', 'Available lists: ' + attr['canSet'].join(', '));
}

module.exports = {
	name: 'helpattr',
	argNumber: '>0',
	helpGroup: 'Misc.',
	description: 'Show the help for a specific attribute',  
	example: '``' + prefix + 'helpattribute dps``',
	additionalInfo: '',
	async execute(message, args, client) {
		await helpAttr(message, args, client);
	}
}