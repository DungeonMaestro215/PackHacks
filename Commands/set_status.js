// set status
// 

const users = require('../users.json');

module.exports = {
    name: 'set_status',
    alias: ['set_Status', 'Set_status', 'Set_Status'],
    description: 'Sets your status',
    args: true,
    usage: '<status name>',
    cooldown: 5,
    guildOnly: false,
    execute(msg, args) {
        msg.channel.send('Your status is now set to ' + args[0]);
        if (!users[msg.author]) {
            users[msg.author] = {};
        }
        users[msg.author]["status"] = args[0];

        console.log(users);
    }
}