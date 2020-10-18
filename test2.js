
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  await page.goto('https://canvas.uw.edu/courses/1396748/external_tools/95443')
  
  await page.setViewport({ width: 1920, height: 937 })
  
  let frames = await page.frames()
  const frame_1072 = frames.find(f => f.url() === 'https://applications.zoom.us/lti/rich')
  await frame_1072.waitForSelector('.zm-comp-header > .zm-comp-header-content > div > div > span')
  await frame_1072.click('.zm-comp-header > .zm-comp-header-content > div > div > span')
  
  await frame_1072.waitForSelector('.zm-comp-header > .zm-comp-header-content > div > div > span')
  await frame_1072.click('.zm-comp-header > .zm-comp-header-content > div > div > span')
  
  await browser.close()
})()
