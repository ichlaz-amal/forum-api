class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    return this._commentRepository.deleteComment(useCasePayload);
  }

  _validatePayload(payload) {
    const { userId, threadId, commentId } = payload;
    if (!userId || !threadId || !commentId) {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('DELETE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = DeleteCommentUseCase;
