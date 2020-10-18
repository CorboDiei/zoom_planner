const calendarMaker = require('./CalendarMaker');

let cm = new calendarMaker();
cm.addEvent('20201017', '0800', '0900', 'fuck this', 'zoom.us');
cm.finishCal();