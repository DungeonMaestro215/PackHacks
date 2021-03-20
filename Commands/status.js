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
        // Read user file
        let users = fs.readFileSync(filename);
        users = JSON.parse(users);

        // Find the user referred to
        try {
            // They could be referred to by username or nickname 
            let id = msg.channel.members.find(user => user.user.username == args[0] || user.nickname == args[0]).id;
            if (users[id]) {
                msg.channel.send(users[id]["status"]);
            } else {
                // User doesn't have a status yet
                msg.channel.send("There is no status for that user.");
            }
        } catch (e) {
            // No user found
            msg.channel.send("That user does not exist. Check your spelling.");
        }
    }
}