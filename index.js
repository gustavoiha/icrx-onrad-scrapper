'use strict';

const setup = require('./src/setup');
const openBrowser = require('./src/open-browser');
const login = require('./src/login');
const filterPeriod = require('./src/filter-period');
const downloadExams = require('./src/download-exams');

const createDate = require('./src/models/date');

const dateToFilter = createDate();

// Run the script
(async () => {
  console.log('Starting script');

  dateToFilter.date = await setup();

  const { browser, page } = await openBrowser();

  await login(page);

  await filterPeriod(page, dateToFilter);

  await downloadExams(browser, page, dateToFilter);

  await browser.close();

  console.log('Finished script!');
})()
