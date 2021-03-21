// const users = require('../users.json');
const fs = require('fs');
const Discord = require('discord.js');
const filename = "./users.json";
const nodeHtmlToImage = require('node-html-to-image');
const { url } = require('inspector');

// set status of user
module.exports = {
    name: 'viewsched',
    alias: ['viewschedule', 'Viewsched', 'ViewSched', 'ViewSchedule', 'Viewschedule'],
    description: 'View user\'s schedule',
    args: false,
    usage: '<optional username>',
    cooldown: 5,
    guildOnly: false,
    execute(msg, args) {
        // Read users file
        let users = fs.readFileSync(filename);
        users = JSON.parse(users);

        // If the user doesn't have a spot, make one
        if (!users[msg.author.id]) {
            users[msg.author.id] = {"username": msg.author.username, "schedule": {}};
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

        let schedData;
        try {
            schedData = users[id]["schedule"];
        } catch (e) {
            msg.channel.send("Selected user does not exist.");
        }

        let schedDataKeys = Object.keys(schedData);

        for (let i = 0; i < schedDataKeys.length; i++) {
            for (let j = 0; j < schedData[schedDataKeys[i]].length; j++) {
                if (schedData[schedDataKeys[i]][j]["day"] == 'MONDAY') {
                    schedule["Monday"].push({ "Class": schedDataKeys[i], "Start Time": schedData[schedDataKeys[i]][j].start, "End Time": schedData[schedDataKeys[i]][j].end })
                } else if (schedData[schedDataKeys[i]][j]["day"] == ('TUESDAY')) {
                    schedule["Tuesday"].push({ "Class": schedDataKeys[i], "Start Time": schedData[schedDataKeys[i]][j].start, "End Time": schedData[schedDataKeys[i]][j].end })
                } else if (schedData[schedDataKeys[i]][j]["day"] == ('WEDNESDAY')) {
                    schedule["Wednesday"].push({ "Class": schedDataKeys[i], "Start Time": schedData[schedDataKeys[i]][j].start, "End Time": schedData[schedDataKeys[i]][j].end })
                } else if (schedData[schedDataKeys[i]][j]["day"] == ('THURSDAY')) {
                    schedule["Thursday"].push({ "Class": schedDataKeys[i], "Start Time": schedData[schedDataKeys[i]][j].start, "End Time": schedData[schedDataKeys[i]][j].end })
                } else if (schedData[schedDataKeys[i]][j]["day"] == ('FRIDAY')) {
                    schedule["Friday"].push({ "Class": schedDataKeys[i], "Start Time": schedData[schedDataKeys[i]][j].start, "End Time": schedData[schedDataKeys[i]][j].end })
                } else if (schedData[schedDataKeys[i]][j]["day"] == ('SATURDAY')) {
                    schedule["Saturday"].push({ "Class": schedDataKeys[i], "Start Time": schedData[schedDataKeys[i]][j].start, "End Time": schedData[schedDataKeys[i]][j].end })
                } else if (schedData[schedDataKeys[i]][j]["day"] == ('SUNDAY')) {
                    schedule["Sunday"].push({ "Class": schedDataKeys[i], "Start Time": schedData[schedDataKeys[i]][j].start, "End Time": schedData[schedDataKeys[i]][j].end })
                }
            }
        }

        let mondayField = "Nothing", tuesdayField = "Nothing", wednesdayField = "Nothing", thursdayField = "Nothing", fridayField = "Nothing", saturdayField = "Nothing", sundayField = "Nothing";

        for (let i = 0; i < schedule['Monday'].length; i++) {
            if (i === 0) mondayField = "";
            mondayField += schedule['Monday'][i]['Class'] + '\n';
            mondayField += 'Start: ' + convertToTimeString(schedule['Monday'][i]['Start Time']) + '\n';
            mondayField += 'End: ' + convertToTimeString(schedule['Monday'][i]['End Time']) + '\n\n';
        }
        for (let i = 0; i < schedule['Tuesday'].length; i++) {
            if (i === 0) tuesdayField = "";
            tuesdayField += schedule['Tuesday'][i]['Class'] + '\n';
            tuesdayField += 'Start: ' + convertToTimeString(schedule['Tuesday'][i]['End Time']) + '\n';
            tuesdayField += 'End: ' + convertToTimeString(schedule['Tuesday'][i]['End Time']) + '\n\n';
        }
        for (let i = 0; i < schedule['Wednesday'].length; i++) {
            if (i === 0) wednesdayField = "";
            wednesdayField += schedule['Wednesday'][i]['Class'] + '\n';
            wednesdayField += 'Start: ' + convertToTimeString(schedule['Wednesday'][i]['End Time']) + '\n';
            wednesdayField += 'End: ' + convertToTimeString(schedule['Wednesday'][i]['End Time']) + '\n\n';
        }
        for (let i = 0; i < schedule['Thursday'].length; i++) {
            if (i === 0) thursdayField = "";
            thursdayField += schedule['Thursday'][i]['Class'] + '\n';
            thursdayField += 'Start: ' + convertToTimeString(schedule['Thursday'][i]['End Time']) + '\n';
            thursdayField += 'End: ' + convertToTimeString(schedule['Thursday'][i]['End Time']) + '\n\n';
        }
        for (let i = 0; i < schedule['Friday'].length; i++) {
            if (i === 0) fridayField = "";
            fridayField += schedule['Friday'][i]['Class'] + '\n';
            fridayField += 'Start: ' + convertToTimeString(schedule['Friday'][i]['End Time']) + '\n';
            fridayField += 'End: ' + convertToTimeString(schedule['Friday'][i]['End Time']) + '\n\n';
        }
        for (let i = 0; i < schedule['Saturday'].length; i++) {
            if (i === 0) saturdayField = "";
            saturdayField += schedule['Saturday'][i]['Class'] + '\n';
            saturdayField += 'Start: ' + convertToTimeString(schedule['Saturday'][i]['End Time']) + '\n';
            saturdayField += 'End: ' + convertToTimeString(schedule['Saturday'][i]['End Time']) + '\n\n';
        }
        for (let i = 0; i < schedule['Sunday'].length; i++) {
            if (i === 0) sundayField = "";
            sundayField += schedule['Sunday'][i]['Class'] + '\n';
            sundayField += 'Start: ' + convertToTimeString(schedule['Sunday'][i]['End Time']) + '\n';
            sundayField += 'End: ' + convertToTimeString(schedule['Sunday'][i]['End Time']) + '\n\n';
        }


        const exampleEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle(users[id]['username'] + '\'s Schedule')
            .addFields(
                { name: 'Monday: ', value: mondayField },
                { name: 'Tuesday', value: tuesdayField },
                { name: 'Wednesday', value: wednesdayField },
                { name: 'Thursday', value: thursdayField },
                { name: 'Friday', value: fridayField },
                { name: 'Saturday', value: saturdayField },
                { name: 'Sunday', value: sundayField },
            )
        // .addField('Inline field title', 'Some value here', true)

        msg.channel.send(exampleEmbed);

        // nodeHtmlToImage({
        //         output: './image.png',
        //         html: `<html>

        //         <body style="font-size: 100px">
        //             <div id="dp"></div>

        //             <script src="daypilot-all.min.js" type="text/javascript"></script>
        //             <script type="text/javascript">
        //                 var dp = new DayPilot.Calendar("dp");
        //                 dp.viewType = "Week";
        //                 dp.init();
        //             </script>

        //         </body>

        //         </html>`
        //     }).then(() =>{
        //         // Send picture to chat
        //         const embed = new Discord.MessageEmbed()
        //             .setTitle('Schedule')
        //             .attachFiles(['./image.png'])
        //             .setImage('attachment://discord.png');
        //         msg.channel.send(embed);
        //     });
    }
}

let convertToTimeString = function (time) {
    let pm = false, formattedTime = time;

    if (formattedTime > 1299) {
        formattedTime -= 1200;
        pm = true;
    }

    formattedTime = formattedTime.toString();

    console.log(formattedTime.length);
    if (formattedTime.length == 3) {
        formattedTime = formattedTime.substring(0, 1) + ':' + formattedTime.substring(1);
    } else if (formattedTime.length == 4) {
        formattedTime = formattedTime.substring(0, 2) + ':' + formattedTime.substring(2);
    }
    console.log(formattedTime);

    if (pm) {
        formattedTime += ' PM';
    } else {
        formattedTime += ' AM';
    }

    return formattedTime;
}