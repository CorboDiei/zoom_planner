class CalendarMaker{

    startCal = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ZoomPlanner-2020\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH"
    endCal = "END:VCALENDAR"

    constructor() {
        const fs = require('fs')
        fs.writeFile('zoomplanner.ics', this.startCal, (err) => {
            if (err) throw err;
        })
        this.curTime = new Date();
    }

    function addEvent(date, start, end, title, link) {
        const fs = require('fs')
        fs.writeFile('zoomplanner.ics', 'BEGIN:VEVENT', (err) => {
            if (err) throw err;
        })
        fs.writeFile('zoomplanner.ics', 'SUMMARY:'+ title, (err) => {
            if (err) throw err;
        })
        fs.writeFile('zoomplanner.ics', 'UID:zoomplanner2020@gmail.com' +
            '\mSEQUENCE:0' +
            '\nSTATUS:CONFIRMED' +
            '\nTRANSP:TRANSPARENT', (err) => {
            if (err) throw err;
        })
        fs.writeFile('zoomplanner.ics', 'DTSTART:'+ start, (err) => {
            if (err) throw err;
        })
        fs.writeFile('zoomplanner.ics', 'DTSTART:'+ end, (err) => {
            if (err) throw err;
        })
        fs.writeFile('zoomplanner.ics', 'DTSTAMP:'+ this.curTime.getDate(), (err) => {
            if (err) throw err;
        })
        fs.writeFile('zoomplanner.ics', 'URL:'+ link, (err) => {
            if (err) throw err;
        })
    }

    function finishCal() {
        const fs = require('fs')
        fs.writeFile('zoomplanner.ics', this.endCal, (err) => {
            if (err) throw err;
        })
    }

}