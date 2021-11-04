const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async updateLike({ userId, commentId }) {
    let query = {
      text: 'SELECT * FROM likes WHERE owner = $1 AND comment = $2',
      values: [userId, commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      query = {
        text: 'INSERT INTO likes VALUES($1, $2)',
        values: [userId, commentId],
      };
    } else {
      query = {
        text: 'UPDATE likes SET liked = $1 WHERE owner = $2 AND comment = $3',
        values: [!result.rows[0].liked, userId, commentId],
      };
    }
    await this._pool.query(query);
  }
}

module.exports = LikeRepositoryPostgres;
