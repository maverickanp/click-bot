import { config } from "dotenv";
import puppeteer from 'puppeteer';

config();


const USERNAME: string = process.env.INSTAGRAM_USERNAME;
const PASSWORD: string = process.env.PASSWORD;
const LOGIN_URL: string = "https://instagram.com/accounts/login";
const TARGET_ENDPOINT: string = "https://www.instagram.com/p/CAklE0nhVdR/";
const WAIT_TIME: number = 60000;
const COMMENT_COUNT: number = 1000000;
const WAIT_TIME_STAY: number = 7000;
export const start = async (): Promise<void> => {

  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: false
  });

  try {
    let page: puppeteer.Page = await browser.newPage();
    await page.setViewport({ width: 1320, height: 768 });

    await page.goto(LOGIN_URL);
    await page.waitFor(() => document.querySelectorAll('input').length);

    await page.type('[name=username]', USERNAME);
    await page.type('[name=password]', PASSWORD);

    await page.$eval('[type=submit]', (elem: any) => elem.click());
    await page.waitFor(WAIT_TIME_STAY);
    await page.goto(TARGET_ENDPOINT);

    let erroIndex = 1;
    for (let index = 1; index < COMMENT_COUNT; index++) {
      console.time("between");
      console.log("click " + index);
      //const itens = await scrapeItens(page);
      //console.table(itens);
      await page.type('textarea', "@arturnunespedrosa");
      //await page.type('textarea', "@maverickanp");
      await page.$eval('[type=submit]', (elem: any) => elem.click());
      await page.waitFor(between((55000), WAIT_TIME));
      console.timeEnd("between");
      const inputValue = await page.$eval('textarea.Ypffh', (elem: any) => elem.value);
      if (inputValue.length > 0) {
        console.log(index - 1 + "Não publicado" + " - Erros: " + erroIndex);
        erroIndex += erroIndex;
      }
      await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    }

    await browser.close();

    process.exit(0);
  } catch (error) {
    console.info(error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test') {
  start();
}


export const between = (min: number, max: number) => {
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

export const scrapeItens = async (page: puppeteer.Page) => {
  let data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("ul.Mr508")).map(
      (compact) => ({
        h3: compact.querySelector("div > li > div > div.C7I1f > div.C4VMK > h3 > div > a").textContent,
        coment: compact.querySelector("div > li > div > div.C7I1f > div.C4VMK > span > a").textContent
      })
    );
  });
  return data;
};