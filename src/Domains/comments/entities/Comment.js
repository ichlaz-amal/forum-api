class Comment {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, date, content, isdelete, likecount } = payload;
    this.id = id;
    this.username = username;
    this.date = date.toISOString();
    this.content = isdelete ? '**komentar telah dihapus**' : content;
    this.likeCount = likecount;
  }

  _verifyPayload({ id, username, date, content, isdelete, likecount }) {
    if (!id || !username || !date || !content
      || isdelete === undefined || likecount === undefined) {
      throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof username !== 'string' || !(date instanceof Date)
      || typeof content !== 'string' || typeof isdelete !== 'boolean' || typeof likecount !== 'number') {
      throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Comment;
