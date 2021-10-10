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
      content: 'A Content',
      owner: 'user-123',
    };
    const expectedAddedComment = new AddedComment({
      id: 'comment-123',
      content: 'a Content',
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockUserRepository.checkAvailabilityUser = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.checkAvailabilityThread = jest.fn()
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
    expect(mockUserRepository.checkAvailabilityUser)
      .toBeCalledWith((new AddComment(useCasePayload)).owner);
    expect(mockThreadRepository.checkAvailabilityThread)
      .toBeCalledWith((new AddComment(useCasePayload)).thread);
    expect(mockCommentRepository.addComment)
      .toBeCalledWith(new AddComment(useCasePayload));
    expect(addedComment).toStrictEqual(expectedAddedComment);
  });
});
