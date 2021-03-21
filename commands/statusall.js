// Ping
// Basic layout of a command.

const fs = require('fs');
const filename = "./users.json";

module.exports = {
    name: 'statusall',
    alias: ['statusAll', 'Statusall', 'StatusAll'],
    description: 'display all users and their statussssss',
    args: false,
    usage: '<arguments>',
    cooldown: 5,
    guildOnly: false,
    execute(msg, args) {
        // read the users.json
        let users = fs.readFileSync(filename);
        users = JSON.parse(users);

        let keys = Object.keys(users);

        // map keys to string output of each users status
        let output = "```" + keys.map((key) => helperMan(key, msg, users)).join('') + "```";
        msg.channel.send(output);

    }
}
// helper function for map
// maps userID keys from users.json to a string array of current statussssss...
function helperMan(userID, msg, users) {
    let output = users[userID]["username"] + " : " + users[userID]["status"] + "\n";
    return output;
}