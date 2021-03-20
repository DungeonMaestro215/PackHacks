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
        // If the user doesn't have a spot, add one
        if (!users[msg.author]) {
            users[msg.author] = {};
        }

        users[msg.author]["dnd"] = args.includes("dnd");

        args.filter(element => element !== "dnd");

        users[msg.author]["status"] = args[0];

        let data = JSON.stringify(users, null, 2);

        fs.writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log("Data written to file");
        });

        fs.readFile(filename, (err, data) => {
            if (err) throw err;
            let users = JSON.parse(data);
            console.log(users);
        });

        // msg.author.setActivity(args[0], { type: "PLAYING" });
    }
}