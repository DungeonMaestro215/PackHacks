// Ping
// Basic layout of a command.
module.exports = {
    name: 'ping',
    description: 'Ping!',
    args: false,
    usage: '<arguments>',
    cooldown: 5,
    guildOnly: false,
    execute(msg, args) {
        msg.channel.send('Pong.');
    }
}