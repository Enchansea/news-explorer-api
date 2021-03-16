const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v, { require_tld: true, allow_utf8_local_part: false }),
      message: 'field "e-mail" must be a valid e-mail address',
    },
  },
  password: {
    type: String,
    reqired: true,
    validate: {
      // eslint-disable-next-line max-len
      validator: (v) => validator.isStrongPassword(v, { minlength: 8, minNumbers: 1, minSymbols: 1 }),
      message: 'Invalid password - minimum length: 8, minimum non alphanumeric characters: 1, min numbers: 1',
    },
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
