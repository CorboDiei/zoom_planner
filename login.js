const puppeteer = require('puppeteer');
const c = require('./c');
const fs = require('fs');
const myuw = require('./myuw.json');
const { password } = require('./c');

async function classesFromMyUW() {
    const browser = await puppeteer.launch({
        headless: false,
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
    await page.keyboard.type(c.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(c.password);
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
    fs.writeFile('./myuw.json', JSON.stringify(courses), err => {
        console.log(err);
    });
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


async function setup(courses) {
    // setup
    const browser = await puppeteer.launch({
        headless: false,
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
    await page.keyboard.type(c.username);
    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(c.password);
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
    
    return calLink;
    // get 

    // get classes
    // const CARD_SELECTOR = '.ic-DashboardCard__header_content';
    // await page.waitForSelector(CARD_SELECTOR);
    // var results = await page.$$eval(CARD_SELECTOR, cards => {
    //     return cards.map(card => {
    //         const properties = {};
    //         const subtitleElement = card.querySelector('.ic-DashboardCard__header-subtitle');
    //         const termElement = card.querySelector('.ic-DashboardCard__header-term');
    //         let term = termElement.innerText.split(' ');
    //         let termVal = 0;
    //         switch(term[0]) {
    //             case 'Autumn':
    //                 termVal = 3;
    //                 break;
    //             case 'Winter':
    //                 termVal = 1;
    //                 break;
    //             case 'Spring':
    //                 termVal = 2;
    //                 break;
    //             default:
    //                 break;
    //         }
    //         properties.termVal = termVal + parseInt(term[1]) * 10;
    //         properties.class = subtitleElement.innerText;
    //         return properties;
    //     })
    // })

    // // parse terms
    // let reprTerm = Math.max(...results.map(a => a.termVal));
    // results = results.filter(entry => entry.termVal === reprTerm).map(a => a.class);
    // console.log(results);

    
    // // collate list
    // let testEntry = results[0];

    // var CLASS_SELECTOR = '[title="' + testEntry + '"]';
    // await page.click(CLASS_SELECTOR);
    // const SECTION_SELECTOR = '.section';
    // await page.waitForSelector(SECTION_SELECTOR);
    // var zoom = await page.$$eval(SECTION_SELECTOR, sections => {
    //     return sections.map(section => {
    //         if (section.querySelector('a').innerText.toLowerCase().includes("zoom")) {
    //             return section.querySelector('a').getAttribute('href');
    //         } else {
    //             return "";
    //         }
    //     })
    // })
    // zoom = zoom.filter(a => a.length > 0)[0];
    // var ZOOM_SELECTOR = '[href="' + zoom + '"]';
    // await page.click(ZOOM_SELECTOR);
    
    
    // console.log(zoom);
    // await page.waitForSelector('iframe');
    // let bodyHTML = await page.content();
    // console.log(bodyHTML);
    // const iFrame_SELECTOR = '#tool_content';
    // await page.waitForSelector(iFrame_SELECTOR);
    // let iFrame = await page.$(iFrame_SELECTOR);
    // console.log(iFrame.contents());

    // const frame_1072 = frames.find(f => f.url() === 'https://applications.zoom.us/lti/rich')
    // const TIME_ZONE_SELECTOR = '.zm-comp-header > .zm-comp-header-content > div > div > span';
    // await frame_1072.waitForSelector(TIME_ZONE_SELECTOR)
    // const tZone = await page.$eval(TIME_ZONE_SELECTOR, e => e.innerText);

    // console.log(tZone);

    // results.forEach(async entry => {
    //     console.log(entry);
    //     var CLASS_SELECTOR = '[title="' + entry + '"]';
    //     await page.click(CLASS_SELECTOR);
    // })
    
}
(async () => {
    // let courseList = await classesFromMyUW();
    console.log(await setup(myuw));
})()
