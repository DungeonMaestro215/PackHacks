// set status
// 
module.exports = {
    name: 'set_status',
    alias: ['set Status', 'Set status', 'Set Status'],
    description: 'Sets your status',
    args: true,
    usage: '<status name>',
    cooldown: 5,
    guildOnly: false,
    execute(msg, args) {
        msg.channel.send('Your status is now set to ' + args[0]);
    }
}