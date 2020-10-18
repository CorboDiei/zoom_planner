const { once } = require('events');
const { createReadStream } = require('fs');
const { createInterface } = require('readline');
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

        console.log('File processed.');
    } catch (err) {
        console.error(err);
    }
}

async function processFile(fileName) {
    await processLineByLine('testCal.ics');
    let userDataArray = userData.split("BEGIN:VEVENT");
    // parses through the entire file by event
    for (let i = 1; i < userDataArray.length; i++) {
        if (userDataArray[i].includes('washington.zoom.us')) {
            zoomEntries += userDataArray[i];
        }
    }
    console.log(zoomEntries);
}

processFile('testCal.ics');

