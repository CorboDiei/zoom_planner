const puppeteer = require('puppeteer');
const c = require("c.js")

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
    const results = await page.$$eval(CARD_SELECTOR, cards => {
        return cards.map(card => {
            const properties = {};
            const subtitleElement = card.querySelector('.ic-DashboardCard__header-subtitle');
            const termElement = card.querySelector('.ic-DashboardCard__header-term');
            properties.term = termElement.innerText;
            properties.class = subtitleElement.innerText;
            properties.selector = card;
            return properties;
        })
    })
    console.log(results)
    // await page.click(CARD_SELECTOR);
}
setup();