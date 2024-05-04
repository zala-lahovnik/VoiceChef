const puppeteer = require('puppeteer');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config();

const getMetaData = async (page) => {
    const meta = await page.evaluate(() => {
        const titleElement = document.querySelector('.font-bold.text-secondary.text-20.md\\:text-28');
        const title = titleElement ? titleElement.innerText : 'No title';

        const peopleElement = document.querySelector('.opacity-input');
        const numberOfPeople = peopleElement ? peopleElement.getAttribute('placeholder') : 'Number of people not specified';

        const categoryItems = document.querySelector('h2.recipe');
        const category = categoryItems ? categoryItems.innerText : 'No category';

        const typeItems = document.querySelectorAll(`.dish-category .dish-category--item`);
        const type = Array.from(typeItems).map((item) => {
            const titleElement = item.querySelector('.text-secondary span');
            const title = titleElement ? titleElement.innerText : 'No title';

            const linkElements = item.querySelectorAll('.text-initial');
            const links = Array.from(linkElements).map((link) => ({
                text: link.innerText,
            }));

            return {
                title,
                links,
            };
        });

        const timeElements = document.querySelectorAll(`.flex.justify-between.items-center.w-full.p-16.md\\:p-0.md\\:mx-64.lg\\:mx-100.text-12.md\\:text-14.text-secondary .flex-col`);
        const times = Array.from(timeElements).map((element) => {
            const labelElement = element.querySelector('.font-bold');
            const label = labelElement ? labelElement.innerText : 'No label';

            const timeText = element.innerText.split('\n')[1].trim();

            return {
                label,
                time: timeText,
            };
        });

        const stepElements = document.querySelectorAll('.timeline-preperation .flex-col');
        const steps = Array.from(stepElements).map((element, index) => ({
            step: index + 1,
            text: element.querySelector('.preparation__text').innerText,
        }));

        const ingredientElements = document.querySelectorAll('.ingredient');
        const ingredients = Array.from(ingredientElements).map((element) => {
            const quantityElement = element.querySelector('.font-bold');
            const quantityText = quantityElement ? quantityElement.innerText.trim() : '0';
            const quantity = parseFloat(quantityText);

            const unitElement = element.querySelector('.ml-4');
            const unit = unitElement ? unitElement.innerText : '';

            const descriptionElement = element.querySelector('.leading-normal');
            const description = descriptionElement ? descriptionElement.innerText : 'No description';

            return {
                quantity,
                unit,
                description,
            };
        });

        const imgElement = document.querySelector('.absolute.calc101.w-full.ng-tns-c130-1');
        const img = imgElement ? imgElement.getAttribute('src') : 'Number of people not specified';

        return { title, category, type, times, numberOfPeople, ingredients, steps, img };
    });

    return meta;
};

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const hrefData = fs.readFileSync('hrefs.json', 'utf-8');
    const hrefs = JSON.parse(hrefData);
    const baseUrl = process.env.URL;
    const recipes = [];

    for (const href of hrefs) {
        if (!href) continue;
        const url = `${baseUrl}${href}`;
        await page.goto(url, { waitUntil: 'networkidle2' });
        const metaData = await getMetaData(page);
        recipes.push(metaData);
    }
    fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2));
    await browser.close();
})();
