const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');
const fs = require('fs');
let userData = '';
let zoomEntries = '';

async function processLineByLine(fileName) {
    try {
        const rl = createInterface({
            input: createReadStream(fileName),
            crlfDelay: Infinity
        });

        rl.on('line', (line) => {
            // Process the line.
            userData += line + "\n";
        });

        await once(rl, 'close');
        console.log(userData);
        console.log('File processed.');
    } catch (err) {
        console.error(err);
    }
}

async function processFile(fileName, myUWData) {
    await processLineByLine(fileName);
    let userDataArray = userData.split("BEGIN:VEVENT");
    // parses through the entire file by event and pulls out ones with zoom links
    for (let i = 1; i < userDataArray.length; i++) {
        if (userDataArray[i].includes('zoom.us')) {
            //zoomEntries += userDataArray[i] + '***';

            // this is checking if it fits with the myUW schedule
            let eventArray = userDataArray[i].split('\n');
            const dtstart = processDate(eventArray[3]);
            //console.log(dtstart);
            const dtend = processDate(eventArray[4]);
            //console.log(dtend);
            for (let j = 0; j < myUWData.length; j++) {
                let time = myUWData[j].time;
                let days = myUWData[j].days;
                //check day of the week works
                if (days.includes(toDayOfWeek(dtstart.getDay()))) {
                    //check time of day works
                    let ts = makeTimeString(dtstart, dtend);
                    ts = ts.split(' ')[0];
                    time = time.split(' ')[0];
                    if (ts.localeCompare(time) === 0) {
                        //if both work, add to zoom entries
                        zoomEntries += userDataArray[i] + '***';
                    }
                }
            }
        }
    }
}
//private helper, makes date out of .ics dtstart/end
function processDate(date) {
    date = date.split(":")[1];
    //console.log(date);
    var year = parseInt(date.substring(0,4));
    var month = parseInt(date.substring(4,6));
    var day = parseInt(date.substring(6,8));
    var hour = parseInt(date.substring(9,11));
    var min = parseInt(date.substring(11,13));
    return new Date(year, month - 1, day, hour - 7, min, 0, 0);
}

function toDayOfWeek(num) {
    switch (num) {
        case 1:
            return 'M';
        case 2:
            return 'T';
        case 3:
            return 'W'
        case 4:
            return 'Th'
        case 5:
            return 'F'
        default:
            alert( "not a valid weekday" );
            break;
    }
}

function makeTimeString(date1, date2) {
    let ret = '';
    let newHour1 = date1.getHours() - 7;
    if (newHour1 > 12) {
        newHour1 -= 12;
    }
    let newHour2 = date2.getHours() - 7;
    if (newHour2 > 12) {
        newHour2 -= 12;
        ret = 'PM';
    } else {
        ret = 'AM';
    }
    return newHour1 + ":" + date1.getMinutes() + " - " + newHour2 + ":" + date2.getMinutes() + ret;
}
// starts the calendar string
function makeCalendar() {
    const startCal = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ZoomPlanner-2020\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";
    return startCal;
}

//adds an event to the calendar string
function addEvent(event) {
    let eventText = 'BEGIN:VEVENT\n';
    return eventText += event;
}

//writes final calendar string to file
function finishCalendar(caltext, filePath) {
    caltext += "END:VCALENDAR";
    var finalFilePath = filePath.split('.')[0] + "2." + filePath.split('.')[1];
    fs.writeFile(finalFilePath, caltext, (err) => {
        if (err) throw err;
    })
    return finalFilePath;
}

async function processZoomEntries(fileName, myUWData) {
    let caltext = makeCalendar();
    await processFile(fileName, myUWData);
    let zoomArray = zoomEntries.split("***")
    for (let i = 0; i < zoomArray.length; i++) {
        caltext += addEvent(zoomArray[i]);
    }
    return finishCalendar(caltext, fileName);
}
// processZoomEntries('user_pXLxAiHUJK4Bgb3PF4oAzbyS4OtUs2PkVVu7cKWb (1).ics', myUWData);

module.exports = processZoomEntries;



