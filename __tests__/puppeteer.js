const puppeteer = require('puppeteer');

const APP = `http://localhost:${process.env.PORT || 3000}/`;

describe('Front-end Integration/Features', () => {
    let browser;
    let page;
  
    beforeAll(async () => {
      browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
      page = await browser.newPage();
    });
  
    afterAll(() => {
      browser.close();
    });
    
    describe('Initial display', () => {
        xit('loads successfully', async () => {
            // We navigate to the page at the beginning of each case so we have a
            // fresh start
            await page.goto(APP);
            await page.waitForSelector('#header');
            const title = await page.$eval('#header', el => el.innerHTML);
            expect(title).toBe('Document');
        });
    });
});