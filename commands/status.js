const fs = require('fs');
const filename = "./users.json";
const daysOfTheWeek = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];

// status
// displays the status of a specified user
module.exports = {
    name: 'status',
    description: 'Displays the status of a specified user.',
    args: false,
    usage: '<user>',
    cooldown: 1,
    guildOnly: false,
    execute(msg, args) {
        // Read user file
        let users = fs.readFileSync(filename), id;
        users = JSON.parse(users);


        let keys = Object.keys(users);
        if (args.length !== 0) {
            for (let i = 0; i < keys.length; i++) {
                if (users[keys[i]]['username'] == args[0]) {
                    id = keys[i];
                }
            }
        } else {
            id = msg.author.id;
        }

        if (!users[id]) {
            users[id] = {"username": users[id].username, "schedule": {}, "status": "Nothing"};
        }

        // Find the user referred to
        try {
            // They could be referred to by username or nickname 
            if (users[id]) {
                let weirdo = isInEvent(id, users);
                if(weirdo) {
                    msg.channel.send(weirdo);
                } else {
                    let expired = hasExpired(users[id]["statusexpiration"]);
                    
                    if (expired) {
                        users[id]["status"] = "Nothing";
                        users[id]["statusexpiration"] = undefined;
                        users[id]["dnd"] = false;
                    } 
                    msg.channel.send(users[id]["status"]);
                }
            } else {
                // User doesn't have a status yet
                msg.channel.send("There is no status for that user.");
            }
        } catch (e) {
            // No user found
            msg.channel.send("That user does not exist. Check your spelling.");
        }

        // Write to the file
        let data = JSON.stringify(users, null, 2);      // Nicely formate the json file (can be removed later)

        fs.writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log("Data written to file");
        });
    }  
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