import puppeteer from 'puppeteer';

const TARGET_ENDPOINT: string = "https://app.sli.do/event/znsanjvw/live/questions";
const CLICK_SELECTOR: string = "#app > div:nth-child(2) > div > div > div > div > div > div.app__content__body > sda-live > div > sda-questions > sda-question-list > div > div:nth-child(1) > div > div > div.question-item__header.mb1 > div.question-item__action-zone > div.score.score--card > button"
const WAIT_TIME: number = 3000;
const VOTES_COUNT: number = 10;

let counter: number = 0;
export const start = async (): Promise<void> => {

  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: true
  });

  try {
    let page: puppeteer.Page = await browser.newPage();
    await page.setViewport({ width: 1320, height: 768 });
    await page.goto(TARGET_ENDPOINT);

    //init: use this block to void 'Navigation timeout of 30000 ms exceeded'
    page.on('request', req => {
      if (req.isNavigationRequest() && req.frame() === page.mainFrame() && req.url() !== TARGET_ENDPOINT) {
        req.abort('aborted');
      } else {
        req.continue();
      }
    });
    await page.setRequestInterception(true);
    await page.goto(TARGET_ENDPOINT, { waitUntil: ['networkidle2'] });
    //end: use this block to void 'Navigation timeout of 30000 ms exceeded'

    await page.waitFor(WAIT_TIME);
    await page.$eval(CLICK_SELECTOR, (elem: any) => elem.click());

    if (counter < VOTES_COUNT) {
      counter++;
      console.log(counter)
      return start();
    }

    process.exit(0);
  } catch (error) {
    console.info(error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  start();
}
