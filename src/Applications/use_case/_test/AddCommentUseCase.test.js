const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const UserRepository = require('../../../Domains/users/UserRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const AddCommentUseCase = require('../AddCommentUseCase');

describe('AddCommentUseCase', () => {
  it('should orchestrating the add comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      thread: 'thread-123',
      content: 'A Comment',
      owner: 'user-123',
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: useCasePayload.content,
      owner: useCasePayload.owner,
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockUserRepository.checkUserId = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.checkThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockCommentRepository.addComment = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAddedComment));

    /** creating use case instance */
    const getCommentUseCase = new AddCommentUseCase({
      userRepository: mockUserRepository,
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const addedComment = await getCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.checkUserId)
      .toBeCalledWith(useCasePayload.owner);
    expect(mockThreadRepository.checkThread)
      .toBeCalledWith(useCasePayload.thread);
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(new AddComment(useCasePayload));
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});
