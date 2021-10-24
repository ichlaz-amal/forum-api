class Reply {
  constructor(payload) {
    this._verifyPayload(payload);
    const { id, username, comment, date, content, isdelete } = payload;
    this.id = id;
    this.comment = comment;
    this.content = isdelete ? '**balasan telah dihapus**' : content;
    this.date = date.toISOString();
    this.username = username;
  }

  _verifyPayload({ id, comment, content, date, username, isdelete }) {
    if (!id || !comment || !content || !date || !username || isdelete === undefined) {
      throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof id !== 'string' || typeof comment !== 'string' || typeof content !== 'string'
      || !(date instanceof Date) || typeof username !== 'string' || typeof isdelete !== 'boolean') {
      throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = Reply;
