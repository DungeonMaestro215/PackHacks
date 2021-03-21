const Discord = require('discord.js');
const fs = require('fs');
const filename = "./users.json";
const daysOfTheWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

module.exports = {
    name: 'statusall',
    alias: ['status-all'],
    description: 'Display all users and their statuses.',
    args: false,
    usage: '<arguments>',
    cooldown: 1,
    guildOnly: false,
    execute(msg, args) {
        // read the users.json
        let users = fs.readFileSync(filename);
        users = JSON.parse(users);

        let keys = Object.keys(users);

        // map keys to string output of each users status
        let output = "```" + keys.map((key) => helperMan(key, msg, users)).join('') + "```";

        const allThatStats = new Discord.MessageEmbed()
        .setTitle('username : status')
        .setColor('#0099ff')
        .setThumbnail("https://i.imgur.com/JjKKF7p.jpg")
        .setDescription(output)

        msg.channel.send(allThatStats);

        console.log(isInEvent(keys[1], users));

        // Write to the file
        let data = JSON.stringify(users, null, 2);      // Nicely formate the json file (can be removed later)

        fs.writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log("Data written to file");
        });
    }
}
// helper function for map
// maps userID keys from users.json to a string array of current statussssss...
function helperMan(userID, msg, users) {
    let weirdo = isInEvent(userID, users);
    let output = "";
    if(weirdo) {
        output = users[userID]["username"] + " : in event - " + weirdo;
    } else {
        if (hasExpired(users[userID]["statusexpiration"])) {
            users[userID]["status"] = "Nothing";
            users[userID]["statusexpiration"] = undefined;
            users[userID]["dnd"] = false;
        }
        output = users[userID]["username"] + " : " + users[userID]["status"];
    }
    if (users[userID]["dnd"]) {
        output += ' dnd'
    }
    output += ' \n'

    return output;
}

// returns bool
// true if user is currently in an event, false else
function isInEvent(userID, users) {
    if (users[userID]["schedule"]) {    // goes in if a schedule exists for this user
        // time for dates
        let d = new Date();
        let day = daysOfTheWeek[d.getDay()];     // String of the day of the week
        let currentTime = 100 * d.getHours() + d.getMinutes();

        let schedule = users[userID]["schedule"];

        let events = Object.keys(schedule);
        console.log(events);
        for (let i = 0; i < events.length; i++) {
            let event = schedule[events[i]];
            for (let j = 0; j < event.length; j++) {
                //returns true if the days match and current time is within the start and end time of the event
                if (event[j]["day"] == day && (currentTime >= event[j]["start"] && currentTime < event[j]["end"])) {
                    return events[i];
                }
            }
        }
    }
    return false;
}

function hasExpired(expirationDate) {
    console.log(new Date().valueOf());
    console.log(expirationDate);

    return new Date().valueOf() > expirationDate;
}