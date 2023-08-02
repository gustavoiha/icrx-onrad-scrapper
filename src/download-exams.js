const delay = require('../lib/delay');
const fs = require('fs');

const DEFAULT_DELAY = 1500;

module.exports = async (browser, page, dateToFilter) => {
  const links = await page.$$('[title="Visualizar laudo"]');

  for (const link of links) {
    await link.click();

    await delay(DEFAULT_DELAY);

    await downloadExam(browser, dateToFilter);
  }
}

const downloadExam = async (browser, dateToFilter) => {
  const pages = await browser.pages();
  const examPage = pages.slice(-1)[0];

  await examPage.waitForSelector('#empresa');

  const companyName = await examPage.evaluate(() => document.getElementById('empresa').textContent.trim());
  const personName = await examPage.evaluate(() => {
    const nameFieldText = document.getElementsByClassName(`titulo_oit`)[3].textContent;

    return nameFieldText.replace('NOME: ', '').trim();
  });

  console.log(`Saving ${personName}'s exam`);

  const folder = `db/exams/${companyName}/${dateToFilter.day}-${dateToFilter.month}-${dateToFilter.year}`;

  // create folder if does not exist
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

  // get amount of files for the same person
  const amountOfExamsForSamePerson = fs.readdirSync(folder).filter(
    (file) => file.startsWith(personName)
  ).length || 0;

  const suffix = amountOfExamsForSamePerson >= 1 ? ` (${amountOfExamsForSamePerson + 1})` : ''

  await examPage.pdf({
    path: `${folder}/${personName}${suffix}.pdf`,
    fullPage: true
  });

  await examPage.close();
}
