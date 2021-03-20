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
    cooldown: 1,
    guildOnly: false,
    execute(msg, args) {
        let users = fs.readFileSync(filename);
        users = JSON.parse(users);

        try {
            let id = msg.channel.client.users.cache.find(user => user.username == args[0]).id;
            if (users[id]) {
                msg.channel.send(users[id]["status"]);
            }
        } catch (e) {
            msg.channel.send("There is no status for that user. Check your spelling.");
        }
    }
}