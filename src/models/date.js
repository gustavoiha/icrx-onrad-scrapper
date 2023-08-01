module.exports = function (date) {
  return {
    date,

    get day () {
      const dayOfMonth = this.date.getDate();

      const dayString = dayOfMonth.toString();

      return dayString.padStart(2, '0');
    },

    get month () {
      const monthNumber = this.date.getMonth() + 1;

      const monthString = monthNumber.toString();

      return monthString.padStart(2, '0');
    },

    get year () {
      const year = this.date.getFullYear();

      const yearString = year.toString();

      return yearString.padStart(2, '0');
    }
  }
}
