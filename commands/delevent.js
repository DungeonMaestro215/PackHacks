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

        if (args.length == 0) {
            // Print all of the user's events w/ numbers
            let output = '```';
            let counter = 0;
            events.forEach(event => {
                sched[event].forEach(occurance => {
                    output += counter + ": " + event + " on " + occurance.day + " from " + occurance.start + " to " + occurance.end + "\n";
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

        console.log(enumeration);
    }
}