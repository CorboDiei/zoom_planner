const puppeteer = require('puppeteer');
const c = require('./c');

async function setup() {
    // setup
    const browser = await puppeteer.launch({
        headless: false,
        slowMo: 10,
        devtools: true
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

    // get classes
    const CARD_SELECTOR = '.ic-DashboardCard__header_content';
    await page.waitForSelector(CARD_SELECTOR);
    var results = await page.$$eval(CARD_SELECTOR, cards => {
        return cards.map(card => {
            const properties = {};
            const subtitleElement = card.querySelector('.ic-DashboardCard__header-subtitle');
            const termElement = card.querySelector('.ic-DashboardCard__header-term');
            let term = termElement.innerText.split(' ');
            let termVal = 0;
            switch(term[0]) {
                case 'Autumn':
                    termVal = 3;
                    break;
                case 'Winter':
                    termVal = 1;
                    break;
                case 'Spring':
                    termVal = 2;
                    break;
                default:
                    break;
            }
            properties.termVal = termVal + parseInt(term[1]) * 10;
            properties.class = subtitleElement.innerText;
            return properties;
        })
    })

    // parse terms
    let reprTerm = Math.max(...results.map(a => a.termVal));
    results = results.filter(entry => entry.termVal === reprTerm).map(a => a.class);
    console.log(results);

    
    // collate list
    let testEntry = results[0];

    var CLASS_SELECTOR = '[title="' + testEntry + '"]';
    await page.click(CLASS_SELECTOR);
    const SECTION_SELECTOR = '.section';
    await page.waitForSelector(SECTION_SELECTOR);
    var zoom = await page.$$eval(SECTION_SELECTOR, sections => {
        return sections.map(section => {
            if (section.querySelector('a').innerText.toLowerCase().includes("zoom")) {
                return section.querySelector('a').getAttribute('href');
            } else {
                return "";
            }
        })
    })
    zoom = zoom.filter(a => a.length > 0)[0];
    var ZOOM_SELECTOR = '[href="' + zoom + '"]';
    await page.click(ZOOM_SELECTOR);
    
    
    console.log(zoom);

    let frames = await page.mainFrame().childFrames()
    console.log(frames);

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
setup();