// set status
// 

// const users = require('../users.json');
const fs = require('fs');
const users = {};
const filename = "./users.json";

module.exports = {
    name: 'set_status',
    alias: ['set_Status', 'Set_status', 'Set_Status'],
    description: 'Sets your status',
    args: true,
    usage: '<status name> <dnd: optional>',
    cooldown: 5,
    guildOnly: false,
    execute(msg, args) {
        // If the user doesn't have a spot, make one
        if (!users[msg.author]) {
            users[msg.author] = {};
        }

        // Do Not Disturb?
        users[msg.author]["dnd"] = args.includes("dnd");

        // Remove 'dnd' string if there is one
        args = args.filter(element => element !== "dnd");

        // Set user's status
        users[msg.author]["status"] = args.join(" ");   // Allow sentences for status

        let data = JSON.stringify(users, null, 2);      // Nicely formate the json file (can be removed later)

        // Write to the file
        fs.writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log("Data written to file");
        });

        // Check if it worked (can also be removed later)
        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            let users = JSON.parse(data);
            console.log(users);
        });

        // msg.author.setActivity(args[0], { type: "PLAYING" });
    }
}