const Comment = require('./Comment');
const Reply = require('../../replies/entities/Reply');

class Comments {
  constructor(comments) {
    this._verifyComments(comments);
    this.ids = []; this.data = [];
    for (let i = 0; i < comments.length; i += 1) {
      this.ids.push(comments[i].id);
      this.data.push({ ...comments[i], replies: [] });
    }
  }

  addReplies(replies) {
    this._verifyReplies(replies);
    for (let i = 0; i < replies.length; i += 1) {
      this._insertReply(replies[i]);
    }
  }

  _insertReply(reply) {
    for (let i = 0; i < this.data.length; i += 1) {
      if (reply.comment === this.data[i].id) {
        this.data[i].replies.push(reply);
      }
    }
  }

  _verifyComments(comments) {
    if (!Array.isArray(comments)) {
      throw new Error('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    for (let i = 0; i < comments.length; i += 1) {
      if (!(comments[i] instanceof Comment)) {
        throw new Error('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }

  _verifyReplies(replies) {
    if (!Array.isArray(replies)) {
      throw new Error('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
    for (let i = 0; i < replies.length; i += 1) {
      if (!(replies[i] instanceof Reply)) {
        throw new Error('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
      }
    }
  }
}

module.exports = Comments;
