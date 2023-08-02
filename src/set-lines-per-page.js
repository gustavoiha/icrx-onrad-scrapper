module.exports = async (page) => {
  await page.waitForSelector('#selectLines');

  await page.select('#selectLines', '500');
}
