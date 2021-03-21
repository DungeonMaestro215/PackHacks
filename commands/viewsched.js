// const users = require('../users.json');
const fs = require('fs');
const Discord = require('discord.js');
const filename = "./users.json";
const nodeHtmlToImage = require('node-html-to-image');
const { url } = require('inspector');
const { deflateSync } = require('zlib');

// set status of user
module.exports = {
    name: 'viewsched',
    alias: ['viewschedule'],
    description: 'View user\'s schedule.',
    args: false,
    usage: '<optional username>',
    cooldown: 1,
    guildOnly: false,
    execute(msg, args) {
        // Read users file
        let users = fs.readFileSync(filename);
        users = JSON.parse(users);

        // did the user input another user?
        let id;
        if (args.length !== 0) {
            let keys = Object.keys(users);
            for (let i = 0; i < keys.length; i++) {
                if (users[keys[i]]['username'] == args[0]) {
                    id = keys[i];
                }
            }
        } else {
            id = msg.author.id;
        }

        // If the user doesn't have a spot, make one
        if (!users[id]) {
            users[id] = {"username": users[id].username, "schedule": {}, "status": "Nothing"};
        }

        if (users[msg.author.id]["schedule"] == undefined) { 
            // Creates schedule object
            users[msg.author.id]["schedule"] = {};
        }

        let schedule = {
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
            "Saturday": [],
            "Sunday": []
        }

        let schedData;
        try {
            schedData = users[id]["schedule"];
        } catch (e) {
            msg.channel.send("Selected user does not exist.");
        }

        let schedDataKeys = Object.keys(schedData);

        for (let i = 0; i < schedDataKeys.length; i++) {
            for (let j = 0; j < schedData[schedDataKeys[i]].length; j++) {
                let day = schedData[schedDataKeys[i]][j]["day"].toLowerCase();
                day = day.charAt(0).toUpperCase() + day.slice(1);
                schedule[day].push({ "Class": schedDataKeys[i], "Start Time": schedData[schedDataKeys[i]][j].start, "End Time": schedData[schedDataKeys[i]][j].end })
            }
        }

        // let mondayField = "Nothing", tuesdayField = "Nothing", wednesdayField = "Nothing", thursdayField = "Nothing", fridayField = "Nothing", saturdayField = "Nothing", sundayField = "Nothing";
        let fields = {
            "Monday": "Nothing",
            "Tuesday": "Nothing",
            "Wednesday": "Nothing",
            "Thursday": "Nothing",
            "Friday": "Nothing",
            "Saturday": "Nothing",
            "Sunday": "Nothing",
        }

        Object.keys(schedule).forEach(day => {
            for (let i = 0; i < schedule[day].length; i++) {
                if (i === 0) fields[day] = "";
                fields[day] += schedule[day][i]['Class'] + '\n';
                fields[day] += 'Start: ' + convertToTimeString(schedule[day][i]['Start Time']) + '\n';
                fields[day] += 'End: ' + convertToTimeString(schedule[day][i]['End Time']) + '\n\n';
            }
        });

        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(users[id]['username'] + '\'s Schedule')
            .addFields(
                { name: 'Monday: ', value: fields["Monday"] },
                { name: 'Tuesday', value: fields["Tuesday"] },
                { name: 'Wednesday', value: fields["Wednesday"] },
                { name: 'Thursday', value: fields["Thursday"] },
                { name: 'Friday', value: fields["Friday"] },
                { name: 'Saturday', value: fields["Saturday"] },
                { name: 'Sunday', value: fields["Sunday"] },
            )
        // .addField('Inline field title', 'Some value here', true)

        msg.channel.send(exampleEmbed);

    }
}

let convertToTimeString = function (time) {
    let pm = false, formattedTime = time;

    if (formattedTime > 1299) {
        formattedTime -= 1200;
        pm = true;
    }

    formattedTime = formattedTime.toString();

    // console.log(formattedTime.length);
    if (formattedTime.length == 3) {
        formattedTime = formattedTime.substring(0, 1) + ':' + formattedTime.substring(1);
    } else if (formattedTime.length == 4) {
        formattedTime = formattedTime.substring(0, 2) + ':' + formattedTime.substring(2);
    }
    // console.log(formattedTime);

    if (pm) {
        formattedTime += ' PM';
    } else {
        formattedTime += ' AM';
    }

    return formattedTime;
}