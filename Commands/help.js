const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: `List all of my commands or info about a specific command.`,
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(msg, args) {
        // 'data' will hold our output
        const data = [];
        const { commands } = msg.client;

        // If no args, display all commands
        if (!args.length) {
            data.push('Here\'s a list of all of my commands:');
            // data.push(commands.map(cmd => cmd.name).join(', '));
            data.push('\`\`\`');
            commands.forEach(cmd => data.push(cmd.name));
            data.push('\`\`\`');

            data.push(`You can send \`${prefix}help [command name]\` to get info on a specific command!`);

            // If help messages get too long, DM them
            // It might, for some reason, not be possible to message them directly
            // return msg.author.send(data, { split: true })
	        //     .then(() => {
		    //         if (msg.channel.type === 'dm') return;
		    //         msg.reply('I\'ve sent you a DM with all my commands!');
	        //     })
	        //     .catch(error => {
		    //         console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
		    //         msg.reply('it seems like I can\'t DM you! Do you have DMs disabled?');
	        //     });

            // split will automatically split the message into 2 or more if it exceeds 2000 characters
            return msg.reply(data, { split: true });
        }

        // Display help info for the specified command
        const name = args[0].toLowerCase();
        const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

        if (!command) {
	        return msg.reply('that\'s not a valid command!');
        }

        data.push(`**Name:** ${command.name}`);

        if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
        if (command.description) data.push(`**Description:** ${command.description}`);
        if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        msg.channel.send(data, { split: true });
    }
}