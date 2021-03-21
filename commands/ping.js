// Ping
// Basic layout of a command.
module.exports = {
    name: 'ping',
    alias: ['Ping'],
    description: 'Ping!',
    args: false,
    usage: '<arguments>',
    cooldown: 1,
    guildOnly: false,
    execute(msg, args) {
        msg.channel.send('Pong.');
    }
}