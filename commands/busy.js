const Discord = require('discord.js');
const fs = require('fs');
const filename = "./users.json";
const daysOfTheWeek = ["SUNDAY", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// status
// displays the status of a specified user
module.exports = {
    name: 'busy',
    alias: ['Busy'],
    description: 'Displays which users are currently busy',
    args: false,
    usage: '',
    cooldown: 1,
    guildOnly: false,
    execute(msg, args) {
        // Read user file
        let users = fs.readFileSync(filename), id;
        users = JSON.parse(users);

        let keys = Object.keys(users);

        // map keys to string output of each users status
        let output = "```" + keys.map((key) => helperMan(key, msg, users)).join('') + "```";

        const allThatStats = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Who is Busy?')
        .setDescription(output)
        msg.channel.send(allThatStats);
    }
}

// helper function for map
// maps userID keys from users.json to a string array of current statussssss...
function helperMan(userID, msg, users) {
    let weirdo = isInEvent(userID, users);
    let output = "";
    if(weirdo) {
        output = users[userID]["username"] + ": " + weirdo + "\n";
    }
    return output;
}

// returns bool
// true if user is currently in an event, false else
function isInEvent(userID, users) {
    if (users[userID]["schedule"]) {    // goes in if a schedule exists for this user
        // time for dates
        var d = new Date();
        var day = daysOfTheWeek[d.getDay()];     // String of the day of the week
        var currentTime = 100 * d.getHours() + d.getMinutes();
        console.log(currentTime);
        console.log(day);

        let schedule = users[userID]["schedule"];

        let events = Object.keys(schedule);
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