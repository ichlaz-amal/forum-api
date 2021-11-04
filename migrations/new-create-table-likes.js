/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('likes', {
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    comment: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    liked: {
      type: 'BOOLEAN',
      default: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
