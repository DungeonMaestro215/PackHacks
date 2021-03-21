// const users = require('../users.json');
const fs = require('fs');
const filename = "./users.json";

// set status of user
module.exports = {
    name: 'setstatus',
    alias: ['setStatus', 'Setstatus', 'SetStatus'],
    description: 'Sets your status',
    args: true,
    usage: '<status name> <dnd: optional>',
    cooldown: 5,
    guildOnly: false,
    execute(msg, args) {
        // Read users file
        let users = fs.readFileSync(filename);
        users = JSON.parse(users);

        // If the user doesn't have a spot, make one
        if (!users[msg.author.id]) {
            users[msg.author.id] = {};
            users[msg.author.id]["username"] = msg.author.username;
        }

        // Do Not Disturb?
        users[msg.author.id]["dnd"] = args.includes("dnd");

        // Remove 'dnd' string if there is one
        args = args.filter(element => element !== "dnd");

        // Set user's status
        users[msg.author.id]["status"] = args.join(" ");   // Allow sentences for status

        let data = JSON.stringify(users, null, 2);      // Nicely formate the json file (can be removed later)

        // Write to the file
        fs.writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log("Data written to file");
        });

        // msg.author.setActivity(args[0], { type: "PLAYING" });
    }
}