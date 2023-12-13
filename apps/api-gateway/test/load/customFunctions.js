const { UserDataGenerator } = require('@trashify/testing');

module.exports = {
  randomEmail: function () {
    return UserDataGenerator.email();
  },

  randomPassword: function () {
    return UserDataGenerator.password(15);
  },

  randomItem: function (array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  },
};
