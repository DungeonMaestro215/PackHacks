const fs = require('fs');
const filename = "./users.json";

// Delete event
module.exports = {
    name: 'delevent',
    alias: ['remevent', 'deleteevent', 'removeevent'],
    description: 'Remove an event from your schedule.',
    args: false,
    usage: '<Event Number>',
    cooldown: 5,
    guildOnly: false,
    execute(msg, args) {
        // Read users file
        let users = fs.readFileSync(filename);
        users = JSON.parse(users);
        const sched = users[msg.author.id].schedule;
        const events = Object.keys(sched);

        // Does the user have events?
        if (sched == undefined || events.lengths == 0) {
            msg.channel.send("You have no events.");
            return;
        }

        if (args.length == 0) {
            // Print all of the user's events w/ numbers
            let output = '```';
            let counter = 0;
            events.forEach(event => {
                sched[event].forEach(occurance => {
                    output += counter + ": " + event + " on " + occurance.day + " from " + convertToTimeString(occurance.start) + " to " + convertToTimeString(occurance.end) + "\n";
                    counter++;
                });
            });
            output += '```';

            msg.channel.send(output);
            return;
        }

        // Each event is uniquely identified by it's event key and an index
        let counter = 0;
        const enumeration = [];
        events.forEach(event => {
            let idx = 0;
            sched[event].forEach(occurance => {
                enumeration[counter] = {"name": event, "index": idx}
                counter++;
                idx++;
            });
        });

        // Was that a valid argument?
        if (args[0] >= enumeration.length) {
            msg.channel.send("Unsuccessful. That was not a valid input.");
            return;
        }

        sched[enumeration[args[0]].name].splice([enumeration[args[0]].index], 1);
        msg.channel.send('Successfully deleted event.');


        const data = JSON.stringify(users, null, 2);      // Nicely formate the json file (can be removed later)
        // Write to the file
        fs.writeFile(filename, data, (err) => {
            if (err) throw err;
            console.log("Data written to file");
        });
    }
}

let convertToTimeString = function(time) {
    let pm = false, formattedTime = time;

    if (formattedTime > 1299) {
        formattedTime -= 1200;
        pm = true;
    }

    formattedTime = formattedTime.toString();

    console.log(formattedTime.length);
    if (formattedTime.length == 3) {
        formattedTime = formattedTime.substring(0,1) + ':' + formattedTime.substring(1);
    } else if (formattedTime.length == 4) {
        formattedTime = formattedTime.substring(0,2) + ':' + formattedTime.substring(2);
    }
    console.log(formattedTime);

    if (pm) {
        formattedTime += ' PM';
    } else {
        formattedTime += ' AM';
    }

    return formattedTime;
}