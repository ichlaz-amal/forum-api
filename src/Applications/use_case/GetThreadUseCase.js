class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const thread = await this._threadRepository.getThread(threadId);
    const comments = await this._commentRepository.getComments(threadId);
    const replies = await this._replyRepository.getReplies(comments.ids);
    comments.addReplies(replies);
    return { ...thread, comments: comments.data };
  }
}

module.exports = GetThreadUseCase;
