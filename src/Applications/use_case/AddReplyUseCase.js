const AddReply = require('../../Domains/replies/entities/AddReply');

class AddReplyUseCase {
  constructor({ userRepository, threadRepository, commentRepository, replyRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const addReply = new AddReply(useCasePayload);
    await this._userRepository.checkUserId(addReply.owner);
    await this._threadRepository.checkThread(addReply.thread);
    await this._commentRepository.checkComment(addReply.comment);
    return this._replyRepository.addReply(addReply);
  }
}

module.exports = AddReplyUseCase;
