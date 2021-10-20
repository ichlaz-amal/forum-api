/* eslint-disable no-await-in-loop */

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
    for (let i = 0; i < comments.length; i += 1) {
      comments[i].replies = await this._replyRepository.getReplies(comments[i].id);
    }
    return { ...thread, comments };
  }
}

module.exports = GetThreadUseCase;
