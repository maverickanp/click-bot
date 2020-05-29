import puppeteer from 'puppeteer';

const TARGET_ENDPOINT: string = "https://www.youtube.com/watch?v=0DDFhHK7usY";
//const CLICK_SELECTOR: string = "#button"
const WAIT_TIME: number = 7000;
const WAIT_TIME_STAY: number = 10000;

const VOTES_COUNT: number = 1000;

let counter: number = 0;
export const start = async (): Promise<void> => {
  let launchOptions = {
    headless: true,
    args: ['--start-maximized',
      '--proxy-server=socks4://131.196.4.226:4145'] // this is where we set the proxy
  };
  const browser: puppeteer.Browser = await puppeteer.launch(launchOptions);

  try {
    let page: puppeteer.Page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 1320, height: 768 });
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X x.y; rv:42.0) Gecko/20100101 Firefox/42.0');

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
    //watch-discussion
    await page.waitFor(WAIT_TIME);
    //await page.$eval(CLICK_SELECTOR, (elem: any) => elem.click());

    // Press tab 10 times (effectively scrolls down on techoverflow.net)
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press("Tab");
    }
    await page.keyboard.press("Enter");

    await page.waitFor(WAIT_TIME_STAY);
    if (counter < VOTES_COUNT) {
      counter++;
      let views = await page.$eval("#watch7-views-info > div.watch-view-count", (elem: any) => elem.textContent);
      console.log(counter + " -  Views: " + views)
      await browser.close();
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
