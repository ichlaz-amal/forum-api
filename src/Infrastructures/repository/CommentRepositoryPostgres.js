const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const Comment = require('../../Domains/comments/entities/Comment');
const CommentRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(addComment) {
    const { thread, content, owner } = addComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, owner, thread, content],
    };
    const result = await this._pool.query(query);
    return new AddedComment({ ...result.rows[0] });
  }

  async checkComment(commentId) {
    const query = {
      text: 'SELECT id FROM comments WHERE id = $1',
      values: [commentId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    }
  }

  async getComments(threadId) {
    const query = {
      text: `
        SELECT
          comments.id AS id,
          users.username AS username,
          to_char(comments.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS date,
          CASE
            WHEN comments.is_delete = true
              THEN '**komentar telah dihapus**'
            ELSE comments.content
          END AS content
        FROM comments
          LEFT JOIN users ON comments.owner = users.id
        WHERE comments.thread = $1
        ORDER BY comments.date ASC
      `,
      values: [threadId],
    };
    const result = await this._pool.query(query);
    const comments = [];
    for (let i = 0; i < result.rows.length; i += 1) {
      comments.push(new Comment({ ...result.rows[i] }));
    }
    return comments;
  }

  async deleteComment({ userId, threadId, commentId }) {
    let query = {
      text: 'SELECT owner FROM comments WHERE id = $1 AND thread = $2',
      values: [commentId, threadId],
    };
    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('komentar tidak ditemukan');
    } if (result.rows[0].owner !== userId) {
      throw new AuthorizationError('user tidak diizinkan mengakses');
    }
    query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [commentId],
    };
    await this._pool.query(query);
  }
}

module.exports = CommentRepositoryPostgres;
