const fs = require('fs');
const filename = "./users.json";

// status
// displays the status of a specefied user
module.exports = {
    name: 'status',
    alias: ['Status'],
    description: 'Displays the status of a specefied user',
    args: false,
    usage: '<user>',
    cooldown: 5,
    guildOnly: false,
    execute(msg, args) {
        let users = {};
        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            users = JSON.parse(data);
        });
        if(users[msg.channel.client.users.get('name', args[0]).id]) {
            msg.channel.send(users[msg.author]["status"]);
        }
    }
}