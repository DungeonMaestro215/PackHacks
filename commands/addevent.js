const fs = require('fs');
const filename = "./users.json";

// Add event
module.exports = {
    name: 'addevent',
    alias: ['Addevent', 'AddEvent', 'addEvent'],
    description: 'Add an event to your schedule',
    args: true,
    usage: '<Event Name> - <Event Day> <Event Start Time> <Event End Time> <Event Day 2> <Event Start Time> <Event End Time> ...',
    example: '>>addevent COMP 410 - Monday 11:30AM 1:00PM Thursday 2:00PM 3:30PM',
    cooldown: 5,
    guildOnly: false,
    execute(msg, args) {
        // Read users file
        let users = fs.readFileSync(filename);
        users = JSON.parse(users);

        const day = {
            MONDAY: "MONDAY", 
            TUESDAY: "TUESDAY", 
            WEDNESDAY: "WEDNESDAY", 
            THURSDAY: "THURSDAY", 
            FRIDAY: "FRIDAY", 
            SATURDAY: "SATURDAY", 
            SUNDAY: "SUNDAY"
        }

        // If the user doesn't have a spot, make one
        if (!users[msg.author.id]) {
            users[msg.author.id] = {"username": msg.author.username, "schedule": {}};
        }
        // console.log(users[msg.author.id]);
        // console.log(users[msg.author.id]["schedule"]);
        // If the user doesn't have a sched, make one
        if (users[msg.author.id]["schedule"] == undefined) { 
            // Creates schedule object
            users[msg.author.id]["schedule"] = {};
        }

        // Creates schedule object
        const dashIndex = args.indexOf('-');
        const eventName = args.slice(0, dashIndex).join(' ');

        let previousEvent = users[msg.author.id]["schedule"][eventName];

        if (previousEvent == undefined) {
            users[msg.author.id]["schedule"][eventName] = [];
        } else {
            previousEvent = users[msg.author.id]["schedule"][eventName].slice(0);
        }

        console.log(previousEvent);

        let responseText = "";

        for (let i = dashIndex + 1; i<args.length; i+=3) {
            try {
                let dayValue = args[i].toUpperCase();
                const startValue = formatTime(args[i+1]);
                const endValue = formatTime(args[i+2]);

                if (endValue < startValue) {
                    responseText = 'Unsuccessful. End time should be later than start time. Type ">>help addevent" for formatting instructions.';
                    users[msg.author.id]["schedule"][eventName] = previousEvent;
                    break;
                }

                if (!Object.values(day).includes(dayValue)) {
                    responseText = 'Unsuccessful. Day input not valid. Type ">>help addevent" for formatting instructions.';
                    users[msg.author.id]["schedule"][eventName] = previousEvent;
                    break;
                } else {
                    dayValue = Object.values(day).find(day => day == dayValue);    // Find the day, obviously
                }

                if ([NaN, null].includes(startValue) || [NaN, null].includes(endValue)) {
                    responseText = 'Unsuccessful. Time value not valid. Type ">>help addevent" for formatting instructions.';
                    users[msg.author.id]["schedule"][eventName] = previousEvent;
                    break;
                } 

                const newEvent = {
                    day: dayValue, 
                    start: formatTime(args[i+1]), 
                    end: formatTime(args[i+2])
                };

                // does this exact event already exist?
                if (users[msg.author.id]["schedule"][eventName].find(event => event.day == newEvent.day && event.start == newEvent.start && event.end == newEvent.end) == undefined) {
                    users[msg.author.id]["schedule"][eventName].push(newEvent);
                    responseText += 'Successfully added: ' + eventName + '\nDay: ' + dayValue + '\nStart Time: ' + args[i+1] + '\nEnd Time: ' + args[i+2] + '\n';
                } else {
                    responseText = 'Unsuccessful. That event already exists.';
                    users[msg.author.id]["schedule"][eventName] = previousEvent;
                    break;
                }
                

            } catch(e) {
                console.log(e);
                responseText = 'Unsuccessful. Type ">>help addevent" for formatting instructions.';
                users[msg.author.id]["schedule"][eventName] = previousEvent;
            }
        }
        
        msg.channel.send(responseText);

        const data = JSON.stringify(users, null, 2);      // Nicely formate the json file (can be removed later)

        // Write to the file
        fs.writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log("Data written to file");
        });

        // msg.author.setActivity(args[0], { type: "PLAYING" });
    }
}

let formatTime = function(time) {
    let pm = false;
    if (time.toUpperCase().includes('PM')) {
        pm = true;
    }

    let formattedTime = parseInt(time.replace(/\D/g,''));
    if (formattedTime < 100) {
        formattedTime *= 100;
    }
    
    if (pm && formattedTime < 1200) {
        formattedTime = parseInt(formattedTime) + 1200;
    } else {
        formattedTime = parseInt(formattedTime);
    }
    return formattedTime;
}
