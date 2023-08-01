'use strict';

const puppeteer = require('puppeteer');
const JSONdb = require('simple-json-db');
const delay = require('./delay');

const authenticationDb = new JSONdb('./db/authentication.json');

const ROOT_URL = 'https://icrx.onrad.com.br/index.php';

const DAY_TO_FILTER = '25';
const MONTH_TO_FILTER = '07';
const YEAR_TO_FILTER = '2023';

const DEFAULT_DELAY = 1000;

let browser;
let page;

const getCredentials = () => ({
  password: authenticationDb.get('password'),
  user: authenticationDb.get('user')
})

const openPage = async () => {
  browser = await puppeteer.launch({ headless: false });
  page = await browser.newPage();

  await page.goto(ROOT_URL);
}

const login = async () => {
  const { password, user } = getCredentials();

  const userSelector = '#username';
  await page.waitForSelector(userSelector);
  const userInputField = await page.$(userSelector);

  await userInputField.type(user);

  console.log('Email entered');

  const passwordSelector = '#password';
  await page.waitForSelector(passwordSelector);
  const passwordInputField = await page.$(passwordSelector);

  await passwordInputField.type(password);

  console.log('Password entered');

  const submitSelector = '#submit';
  await page.waitForSelector(submitSelector);
  page.click(submitSelector);

  console.log('Submitted password');

  await page.waitForNavigation();

  console.log('Page loaded after login');
}

const filterPeriod = async () => {
  console.log('Filtering by period');

  const periodFilterSelector = '#periodFilter';
  await page.waitForSelector(periodFilterSelector);
  page.click(periodFilterSelector);

  const dateFromSelector = '#dateFrom';
  await page.waitForSelector(dateFromSelector, {
    visible: true
  });

  await delay(DEFAULT_DELAY);

  console.log('Inserting dateFrom');
  await page.evaluate((date) => {
    const element = document.getElementById('dateFrom');

    element.value = date;
  }, `${YEAR_TO_FILTER}-${MONTH_TO_FILTER}-${DAY_TO_FILTER}`);

  console.log('Inserting dateTo');
  await page.evaluate((date) => {
    const element = document.getElementById('dateTo');

    element.value = date;
  }, `${YEAR_TO_FILTER}-${MONTH_TO_FILTER}-${DAY_TO_FILTER}`);

  const confirmPeriodSelector = '#confirmPeriodFilter';
  await page.waitForSelector(confirmPeriodSelector);
  page.click(confirmPeriodSelector);
}

const checkHasLoadedPeriod = async () => await page.evaluate(async (day, month, year) => {
  const table = document.getElementById('worklistCtrl');

  const dateCheck = `Período: ${day}/${month}/${year} até ${day}/${month}/${year}`;

  return table.textContent.includes(dateCheck);
}, DAY_TO_FILTER, MONTH_TO_FILTER, YEAR_TO_FILTER);

const examsToLoad = async () => {
  let hasLoadedPeriod = false;

  while (!hasLoadedPeriod) {
    console.log('Waiting for filtered exams to load');

    await delay(DEFAULT_DELAY);

    hasLoadedPeriod = await checkHasLoadedPeriod();
  }

  console.log('Finished loading filtered exams');
}

const downloadAllExams = async () => {
  const links = await page.$$('[title="Visualizar laudo"]');

  for (const link of links) {
    await downloadExam(link);
  }
}

const downloadExam = async (link) => {
  console.log('Opening an exame');

  await link.click();

  // const newTarget = await this._browser.waitForTarget(target => target.opener() === page.target);
  // const newPage = await newTarget.page();

  // await newPage.waitForSelector('body');
}

// Run the script
(async () => {
  console.log('Starting script');

  await openPage();

  await login();

  await filterPeriod();

  await examsToLoad();

  await downloadAllExams();
})()
