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

        // console.log(msg.channel.members.find(user => user.user.username == args[0] || user.nickname == args[0]));
        // console.log("Members: ");
        // console.log(msg.channel.members);
        // console.log(Object.keys(msg.channel.members));
        // console.log(msg.channel.members.get('85047986727424000').nickname);

        try {
            let id = msg.channel.members.find(user => user.user.username == args[0] || user.nickname == args[0]).id;
            if (users[id]) {
                msg.channel.send(users[id]["status"]);
            } else {
                msg.channel.send("There is no status for that user.");
            }
        } catch (e) {
            msg.channel.send("That user does not exist. Check your spelling.");
        }
    }
}