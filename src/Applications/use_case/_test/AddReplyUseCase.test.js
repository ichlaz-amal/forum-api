const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the add reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      comment: 'comment-123',
      content: 'A Reply',
      owner: 'user-123',
    };
    const expectedAddedReply = new AddedReply({
      id: 'reply-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockUserRepository.checkUserId = jest.fn(() => Promise.resolve());
    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(expectedAddedReply));

    /** creating use case instance */
    const getReplyUseCase = new AddReplyUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const addedReply = await getReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.checkUserId)
      .toBeCalledWith(useCasePayload.owner);
    expect(mockThreadRepository.checkThread)
      .toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.checkComment)
      .toBeCalledWith(useCasePayload.comment);
    expect(mockReplyRepository.addReply)
      .toBeCalledWith(new AddReply(useCasePayload));
    expect(addedReply).toStrictEqual(expectedAddedReply);
  });
});
