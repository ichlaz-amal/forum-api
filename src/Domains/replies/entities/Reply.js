class Reply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, date, content } = payload;
    this.id = id;
    this.content = content;
    this.date = date;
    this.username = username;
  }

  _verifyPayload({ id, content, date, username }) {
    if (!id || !content || !date || !username) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof content !== 'string'
        || typeof date !== 'string' || typeof username !== 'string') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
