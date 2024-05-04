const puppeteer = require('puppeteer');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const baseUrl = process.env.BASE_URL;
    const uniqueHrefs = new Set();

    for (let i = 1; i <= 5; i++) {
        const url = `${baseUrl}${i}`;
        console.log('Opening:', i);

        await page.goto(url, { waitUntil: 'networkidle2' });

        const mainDivSelector = '.p-8';
        await page.waitForSelector(mainDivSelector);

        const hrefs = await page.evaluate((selector) => {
            const itemElements = document.querySelectorAll(selector);

            const hrefValues = Array.from(itemElements).map((element) => {
                const linkElement = element.querySelector('a.group');
                return linkElement ? linkElement.getAttribute('href') : null;
            });

            return hrefValues.filter((href) => href !== null);
        }, mainDivSelector);

        hrefs.forEach((href) => uniqueHrefs.add(href));
    }

    const uniqueHrefArray = Array.from(uniqueHrefs);
    fs.writeFileSync('hrefs.json', JSON.stringify(uniqueHrefArray, null, 2));
    
    await browser.close();
})();
