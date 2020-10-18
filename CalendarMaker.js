class CalendarMaker{

    startCal = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//ZoomPlanner-2020\nCALSCALE:GREGORIAN\nMETHOD:PUBLISH"
    endCal = "END:VCALENDAR"

    constructor() {
        this.writeCal(this.startCal);
        this.curTime = new Date();
    }

    addEvent(date, start, end, title, link) {
        this.writeCal('BEGIN:VEVENT');
        this.writeCal('SUMMARY:'+ title);
        this.writeCal('UID:zoomplanner2020@gmail.com' +
            '\mSEQUENCE:0' +
            '\nSTATUS:CONFIRMED' +
            '\nTRANSP:TRANSPARENT');
        this.writeCal('DTSTART:'+ start);
        this.writeCal('DTEND:'+ end);
        this.writeCal('DTSTAMP:'+ this.curTime.getFullYear() + this.curTime.getMonth() + this.curTime.getDate() + "T000000");
        this.writeCal('URL:'+ link);
        this.writeCal('END:VEVENT');
    }

    finishCal() {
        this.writeCal(this.endCal);
    }

    // private helper method
    writeCal(string) {
        const fs = require('fs')
        fs.writeFile('zoomplanner.ics', string, (err) => {
            if (err) throw err;
        })
    }

}