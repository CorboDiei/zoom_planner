const fs = require('fs');

function makeCalendar() {
    const startCal = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ZoomPlanner-2020\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH\n";
    return startCal;
}

function addEvent(title, date, start, end, link) {
    const curTime = new Date();
    let eventText = 'BEGIN:VEVENT\n';
    eventText +=  'SUMMARY:'+ title + '\n';
    eventText += 'UID:' + Date.now() + 'zoomplanner2020@gmail.com' +
        '\nSEQUENCE:0' +
        '\nSTATUS:CONFIRMED' +
        '\nTRANSP:TRANSPARENT\n';
    eventText += 'DTSTART:'+ date + start + '\n';
    eventText += 'DTEND:'+ date + end + '\n';

    let month = curTime.getMonth();
    if (month < 10) {
        month = '0' + month;
    }
    eventText += 'DTSTAMP:'+ curTime.getFullYear() + month + curTime.getDate() + "T000000\n";

    eventText += 'URL:'+ link + '\n';
    eventText += 'END:VEVENT\n';
    return eventText;
}

function finishCalendar(caltext) {
    caltext += "END:VCALENDAR";
    fs.writeFile('zoomplanner.ics', caltext, (err) => {
        if (err) throw err;
    })
}
let caltext = makeCalendar();
caltext += addEvent('tester', '20201017', 'T060000', 'T070000', 'zoom.us');
caltext += addEvent('tester2', '20201017', 'T073000', 'T083000', 'zoom.us');
finishCalendar(caltext);
