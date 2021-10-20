const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../Domains/replies/entities/AddedReply');
const Reply = require('../../Domains/replies/entities/Reply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(addReply) {
    const { comment, content, owner } = addReply;
    const id = `reply-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO replies VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, owner, comment, content],
    };
    const result = await this._pool.query(query);
    return new AddedReply({ ...result.rows[0] });
  }

  async getReplies(commentId) {
    const query = {
      text: `
        SELECT
          replies.id AS id,
          users.username AS username,
          to_char(replies.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS date,
          CASE
            WHEN replies.is_delete = true
              THEN '**balasan telah dihapus**'
            ELSE replies.content
          END AS content
        FROM replies
          LEFT JOIN users ON replies.owner = users.id
        WHERE replies.comment = $1
        ORDER BY replies.date ASC
      `,
      values: [commentId],
    };
    const result = await this._pool.query(query);
    const replies = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      replies.push(new Reply({ ...result.rows[i] }));
    }
    return replies;
  }

  async deleteReply({ userId, threadId, commentId, replyId }) {
    let query = {
      text: `SELECT owner FROM replies WHERE id = $1 AND comment = (
        SELECT id FROM comments WHERE id = $2 AND thread = $3
      )`,
      values: [replyId, commentId, threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('balasan tidak ditemukan');
    } if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('user tidak diizinkan mengakses');
    }
    query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [replyId],
    };
    await this._pool.query(query);
  }
}

module.exports = ReplyRepositoryPostgres;
