const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  // Domain Entity
  'ADD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY':
    new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
  'ADD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'),
  'ADD_THREAD.NOT_CONTAIN_NEEDED_PROPERTY':
      new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
  'ADD_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
  'LOGIN_USER.NOT_CONTAIN_NEEDED_PROPERTY':
    new InvariantError('harus mengirimkan username dan password'),
  'LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('username dan password harus string'),
  'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY':
    new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR':
    new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
  'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER':
    new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),

  // Use Case Payload
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY':
    new InvariantError('harus mengirimkan token refresh'),
  'REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
  'LOGOUT_USER_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY':
    new InvariantError('harus mengirimkan token refresh'),
  'LOGOUT_USER_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('refresh token harus string'),
};

module.exports = DomainErrorTranslator;
