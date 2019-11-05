module.exports = {
  $schema: '../schema/config.schema.json',
  mongo: {
    host: '127.0.0.1',
    user: '',
    password: '',
    db: 'eecom-freedom'
  },
  'web-app': {
    port: 8081,
    secret: 'Z$@r>h[u%#9R#UlL&u?ES$/s3Fe;tf',
    'token-expires-in': '30m',
    'refresh-token-expires-in': '1d'
  },
  'base-path': '/api/v1',
  'default-admin-permissions': ['*'],
  'default-user-permissions': ['profile-view'],
  'default-role-filters': {
    student: [
      'last-login-after',
      'last-login-before',
      'login-count-greater-than',
      'signed-up-after',
      'signed-up-before'
    ],
    owner: ['last-login-after', 'last-login-before', 'login-count-greater-than', 'signed-up-after'],
    author: ['last-login-after', 'last-login-before', 'login-count-greater-than'],
    affiliate: ['last-login-after', 'last-login-before']
  }
};