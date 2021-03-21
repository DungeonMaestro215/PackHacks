
const fs = require('fs');
const filename = "./users.json";

module.exports = {
    name: 'signup',
    alias: ['start'],
    description: 'initialize users in file. GOTTA DO THIS',
    args: false,
    usage: '<arguments>',
    cooldown: 1,
    guildOnly: false,
    execute(msg, args) {
        let users = fs.readFileSync(filename), id;
        users = JSON.parse(users);

        id = msg.author.id;

        if (!users[id]) {
            users[id] = {"username": msg.author.username, "schedule": {}, "status": "Nothing", "dnd": false};
            msg.channel.send("You're all set up. You can start changing your status and schedule now!");
        } else {
            msg.channel.send("You already exist in the data base!");
        }

        // Write to the file
        let data = JSON.stringify(users, null, 2);      // Nicely formate the json file (can be removed later)

        fs.writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log("Data written to file");
        });
    }
}