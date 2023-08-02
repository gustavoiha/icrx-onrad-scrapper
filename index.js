'use strict';

const setup = require('./src/setup');
const openBrowser = require('./src/open-browser');
const login = require('./src/login');
const setLinesPerPage = require('./src/set-lines-per-page');
const filterPeriod = require('./src/filter-period');
const downloadExams = require('./src/download-exams');

// Run the script
(async () => {
  console.log('Starting script');

  const dateToFilter = await setup();

  const { browser, page } = await openBrowser();

  await login(page);

  await setLinesPerPage(page);

  await filterPeriod(page, dateToFilter);

  await downloadExams(browser, page, dateToFilter);

  await browser.close();

  console.log('Finished script!');
})()
