'use strict';

const puppeteer = require('puppeteer');
const JSONdb = require('simple-json-db');

const authenticationDb = new JSONdb('./db/authentication.json');

const ROOT_URL = 'https://icrx-onrad.com.br/index.php';

const getCredentials = () => ({
  password: passwordDb.get('password'),
  user: passwordDb.get('user')
})

const openPage = async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(ROOT_URL);

  return page;
}

const login = (page) => {
  const { password, user } = getCredentials();
}

// Run the script
(async () => {
  // const page = await openPage();

  // await login(page);

  authenticationDb.set('user', 'tecnix');
  authenticationDb.set('password', 'vi250206');
})()
