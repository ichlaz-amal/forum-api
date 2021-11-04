/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const LikesTableTestHelper = {
  async addLike({ owner = 'user-123', comment = 'comment-123' }) {
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2)',
      values: [owner, comment],
    };
    await pool.query(query);
  },

  async findLike({ owner = 'user-123', comment = 'comment-123' }) {
    const query = {
      text: 'SELECT * FROM likes WHERE owner = $1 AND comment = $2',
      values: [owner, comment],
    };
    const result = await pool.query(query);
    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM likes WHERE 1=1');
  },
};

module.exports = LikesTableTestHelper;
