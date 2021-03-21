const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: `List all of my commands or info about a specific command.`,
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 1,
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
        if (command.example) data.push(`**Example:** ${command.example}`);

        data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

        msg.channel.send(data, { split: true });
    }
}