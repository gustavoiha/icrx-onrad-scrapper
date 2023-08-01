const delay = require('../lib/delay');

const DEFAULT_DELAY = 1000;

const checkHasLoadedPeriod = async (page, dateToFilter) => await page.evaluate(async (day, month, year) => {
  const table = document.getElementById('worklistCtrl');

  const dateCheck = `Período: ${day}/${month}/${year} até ${day}/${month}/${year}`;

  return table.textContent.includes(dateCheck);
}, dateToFilter.day, dateToFilter.month, dateToFilter.year);

const examsToLoad = async (page, dateToFilter) => {
  let hasLoadedPeriod = false;

  while (!hasLoadedPeriod) {
    console.log('Waiting for filtered exams to load');

    await delay(DEFAULT_DELAY);

    hasLoadedPeriod = await checkHasLoadedPeriod(page, dateToFilter);
  }

  console.log('Finished loading filtered exams');
}

module.exports = async (page, dateToFilter) => {
  console.log('Filtering by period');

  const periodFilterSelector = '#periodFilter';
  await page.waitForSelector(periodFilterSelector);
  page.click(periodFilterSelector);

  const dateFromSelector = '#dateFrom';
  await page.waitForSelector(dateFromSelector, {
    visible: true
  });

  await delay(DEFAULT_DELAY);

  console.log('Filtering by dates');
  await page.evaluate((date) => {
    const element = document.getElementById('dateFrom');

    element.value = date;
  }, `${dateToFilter.year}-${dateToFilter.month}-${dateToFilter.day}`);

  await page.evaluate((date) => {
    const element = document.getElementById('dateTo');

    element.value = date;
  }, `${dateToFilter.year}-${dateToFilter.month}-${dateToFilter.day}`);

  const confirmPeriodSelector = '#confirmPeriodFilter';
  await page.waitForSelector(confirmPeriodSelector);
  page.click(confirmPeriodSelector);

  await examsToLoad(page, dateToFilter);
}
