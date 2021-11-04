class LikeCommentUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    this._validatePayload(useCasePayload);
    const { userId, threadId, commentId } = useCasePayload;
    await this._threadRepository.checkThread(threadId);
    await this._commentRepository.checkComment(commentId);
    return this._likeRepository.updateLike({ userId, commentId });
  }

  _validatePayload(payload) {
    const { userId, threadId, commentId } = payload;
    if (!userId || !threadId || !commentId) {
      throw new Error('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof userId !== 'string' || typeof threadId !== 'string' || typeof commentId !== 'string') {
      throw new Error('LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LikeCommentUseCase;
