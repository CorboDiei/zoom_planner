const puppeteer = require('puppeteer');
// const c = require('./c');
const fs = require('fs');
const myuw = require('./myuw.json');
const https = require('https');

async function classesFromMyUW(username, password) {
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 10,
        devtools: true,
        args: [
            '--disable-web-security'
        ]
    })
    const page = await browser.newPage();
    await page.setViewport({width: 1199, height: 900});

    const link = 'https://my.uw.edu/';
    await page.goto(link, {
        waituntil: 'domcontentloaded'
    })
    const USERNAME_SELECTOR = '#weblogin_netid';
    const PASSWORD_SELECTOR = '#weblogin_password';
    const SUBMIT_SELECTOR = '#submit_button';
    await page.waitForSelector(USERNAME_SELECTOR);
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(password);
    await page.click(SUBMIT_SELECTOR);

    const ACADEMICS_SELECTOR = '[href="/academics/"]';
    await page.waitForSelector(ACADEMICS_SELECTOR);
    await page.click(ACADEMICS_SELECTOR);

    const COURSE_CARD_SELECTOR = '.fade-in';
    await page.waitForSelector(COURSE_CARD_SELECTOR);
    
    const courses = await page.$$eval(COURSE_CARD_SELECTOR, cards => {
        const inner_courses = [];
        cards.forEach(card => {
            var courseDays = card.querySelectorAll('.course-days');
            courseDays.forEach(time => {
                props = {};
                props.title = card.querySelector('.courseIDtitle').innerText;
                props.time = card.querySelector('.course-time').innerText;
                props.days = [];
                var days = time.querySelectorAll('abbr');
                days.forEach(day => props.days.push(day.innerText));
                inner_courses.push(props);
            })
        })
        return inner_courses;
    })
    // fs.writeFile('./myuw.json', JSON.stringify(courses), err => {
    //     console.log(err);
    // });
    console.log(courses);

    // const COURSE_ID_SELECTOR = '.courseIDtitle';
    // await page.waitForSelector(COURSE_ID_SELECTOR);
    // const courses = await page.$$eval(COURSE_ID_SELECTOR, spans => {
    //     return spans.map(span => span.innerText);
    // })
    // const SCHEDULE_SELECTOR = '.course-schedule-row';
    // const schedule = await page.$$eval(SCHEDULE_SELECTOR, sched => {
    //     return sched.map(schrow => {
    //         props = {};
    //         var courseDays = [].slice.call(schrow.querySelector('.course-days').children);
    //         props.days = courseDays.map(day => day.innerText);
    //         props.time = schrow.querySelector('.course-time').innerText;
    //         return props;
    //     })
    // })
    // console.log(schedule);
    await browser.close();
    return courses;
}


async function getCalendar(courses, username, password) {
    // setup
    const browser = await puppeteer.launch({
        headless: true,
        slowMo: 10,
        devtools: true,
        args: [
            '--disable-web-security'
        ]
    })
    const page = await browser.newPage();
    await page.setViewport({width: 1199, height: 900});

    // get online
    const link = 'https://apps.canvas.uw.edu/wayf';
    const LOGIN_SELECTOR = '#login';
    await page.goto(link, {
        waituntil: 'domcontentloaded'
    });
    await page.click(LOGIN_SELECTOR);
    
    // login
    const USERNAME_SELECTOR = '#weblogin_netid';
    const PASSWORD_SELECTOR = '#weblogin_password';
    const SUBMIT_SELECTOR = '#submit_button';
    await page.waitForSelector(USERNAME_SELECTOR);
    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(password);
    await page.click(SUBMIT_SELECTOR);

    // to calendar
    const CALENDAR_SELECTOR = '[href="/calendar"]';
    await page.waitForSelector(CALENDAR_SELECTOR);
    await page.click(CALENDAR_SELECTOR);

    //check right calendars
    const classNums = courses.map(course => {
        var fullTitleSplit = course.title.split(' ');
        return fullTitleSplit[0] + " " + fullTitleSplit[1];
    })
    console.log(classNums); 
    const LIST_SELECTOR = '.context_list_context';
    await page.waitForSelector(LIST_SELECTOR);
    const check = await page.$$eval(LIST_SELECTOR, cals => {
        return cals.map(cal => {
            props = {};
            props.checked = cal.querySelector('span').getAttribute('aria-checked') === 'true';
            props.box = cal.querySelector('span').getAttribute('aria-labelledby');
            const calLabelSplit = cal.querySelector('label').innerText.split(' ');
            props.code = calLabelSplit[0] + " " + calLabelSplit[1];
            return props;
        })
    })
    console.log(check);

    const check2 = check.forEach(e => {
        const check2_int = [];
        const BOX_SELECTOR = '[aria-labelledby="' + e.box + '"]';
        if (classNums.includes(e.code)) {
            if (!e.checked) {
                check2_int.push("1");
                page.click(BOX_SELECTOR);
            } else {
                check2_int.push("2");
            }
        } else if (e.checked) {
            check2_int.push("3");
            page.click(BOX_SELECTOR);
        } else {
            check2_int.push("4");
        }
        return check2_int;
    })
    
    const GET_CAL_SELECTOR = '[aria-controls="calendar_feed_box"]';
    await page.click(GET_CAL_SELECTOR);

    const P_FEED_SELECTOR = '#calendar-feed-box-lower';
    await page.waitForSelector(P_FEED_SELECTOR);
    const calLink = await page.$eval(P_FEED_SELECTOR, cal => {
        return cal.querySelector('input').getAttribute('value');
    })
    const id = Math.random().toString(36).substring(7);
    const pathname = __dirname + "/serve/" + id + '.ics';
    const file = fs.createWriteStream(pathname)
    const request = https.get(calLink, res => {
        res.pipe(file);
    })
    return [pathname, id];
    
}

const main = async (username, password) => {
    let courseList = await classesFromMyUW(username, password);
    let calendar = await getCalendar(courseList, username, password);
    return [courseList, calendar];
}

module.exports = main;
