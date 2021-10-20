class DeleteReplyUseCase {
  constructor({ replyRepository }) {
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    return this._replyRepository.deleteReply(useCasePayload);
  }

  _validatePayload(payload) {
    const { userId, threadId, commentId, replyId } = payload;
    if (!userId || !threadId || !commentId || !replyId) {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof userId !== 'string' || typeof threadId !== 'string'
        || typeof commentId !== 'string' || typeof replyId !== 'string') {
      throw new Error('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteReplyUseCase;
