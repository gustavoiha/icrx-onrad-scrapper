const JSONdb = require('simple-json-db');

const authenticationDb = new JSONdb('./db/authentication.json');

const getCredentials = () => ({
  password: authenticationDb.get('password'),
  user: authenticationDb.get('user')
})

module.exports = async (page) => {
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
