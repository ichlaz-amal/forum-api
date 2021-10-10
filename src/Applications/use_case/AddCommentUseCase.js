const AddComment = require('../../Domains/comments/entities/AddComment');

class AddCommentUseCase {
  constructor({ userRepository, threadRepository, commentRepository }) {
    this._userRepository = userRepository;
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const addComment = new AddComment(useCasePayload);
    await this._userRepository.checkAvailabilityUser(addComment.owner);
    await this._threadRepository.checkAvailabilityThread(addComment.thread);
    return this._commentRepository.addComment(addComment);
  }
}

module.exports = AddCommentUseCase;
