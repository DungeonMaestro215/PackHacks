// Import Discord
const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');
const fs = require('fs');
const { time } = require('console');

// Get some commands in here
client.commands = new Discord.Collection();
const cooldowns = new Discord.Collection();     // Allows us to implement cooldowns
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));     // Get all of the command files
for (const file of commandFiles) {
    // For each file, get it's command and add it to the collection
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// Indicate when the bot is up
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Read every message and respond when appropriate
client.on('message', msg => {
    if (msg.content.startsWith(prefix) || msg.author.bot) return;

    // Anything that isn't specifically a command can go here.
    
});

// Commands
client.on('message', msg => {
    // Should I bother reading this message?
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    // Collect the args (remove prefix, trim whitespace, split around spaces)
    const args = msg.content.slice(prefix.length).trim().split(/ +/);   // Regex for lots of spaces
    const commandName = args.shift().toLowerCase();     // Command name was the first element of args
    
    // What do?
    const command = client.commands.get(commandName)            // Grab the command 
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));   // Or see if it is under an alias
    
    if (!command) return;       // Return if the there is no match

    // Can we execute this command here?
    if (command.guildOnly && msg.channel.type === 'dm') {
        return msg.reply('I can\'t execute that command inside DMs!');
    }

    // Does this command require arguments?
    if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${msg.author}!`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return msg.channel.send(reply);
    }

    // Implementing cooldowns
    if (!cooldowns.has(command.name)) {
        // We will need to be able to track cooldowns > command > user > timestamp
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;  // Defaults to 3 seconds

    // If the command is on cooldown for this user, notify them of their time remaining
    if (timestamps.has(msg.author.id)) {
        const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
         if (now < expirationTime) {
             const timeLeft = (expirationTime - now) / 1000;
             return msg.reply(`Please wait ${timeLeft.toFixed(1)} more seconds before reusing the \`${command.name}\` command.`);
         }
    }
    timestamps.set(msg.author.id, now);  // Attach author w/ time they called the command
    setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

    try {
        command.execute(msg, args);
    } catch (err) {
        console.error(err);
        msg.reply('There was an error executing that command.');
    }
});

// Secret login
client.login(token);