const puppeteer = require('puppeteer');

const ROOT_URL = 'https://icrx.onrad.com.br/index.php';

module.exports = async () => {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1800,
    height: 1800
  });

  await page.goto(ROOT_URL);

  return {
    browser,
    page
  }
}
