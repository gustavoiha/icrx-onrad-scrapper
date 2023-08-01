const prompts = require('prompts');
const JSONdb = require('simple-json-db');
const setupDb = new JSONdb('./db/setup.json');
const createDate = require('./models/date');

module.exports = async () => {
  const dateResponse = await prompts([{
    type: 'date',
    name: 'dateToFilter',
    message: 'Which date to get exams from?',
    initial: setupDb.get('lastDateToFilter') ? new Date(setupDb.get('lastDateToFilter')) : new Date(),
    mask: 'DD/MM/YYYY',
    validate: (date) => date > Date.now() ? 'Not in the future' : true
  }]);


  setupDb.set('lastDateToFilter', dateResponse.dateToFilter.toISOString());

  return createDate(dateResponse.dateToFilter);
}
