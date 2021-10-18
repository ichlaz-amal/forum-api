const Thread = require('../../../Domains/threads/entities/Thread');
const Comment = require('../../../Domains/comments/entities/Comment');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const GetThreadUseCase = require('../GetThreadUseCase');

describe('GetThreadUseCase', () => {
  it('should orchestrating the get thread action correctly', async () => {
    // Arrange
    const useCasePayload = { threadId: 'thread-123' };
    const expectedThread = new Thread({
      id: useCasePayload.threadId,
      title: 'A Thread',
      body: 'A Body',
      date: '2021-08-08T07:00:00.000Z',
      username: 'dicoding',
    });
    const expectedComments = [new Comment({
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:00:00.000Z',
      content: 'A Comment',
    })];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedComments));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getComments)
      .toBeCalledWith(useCasePayload.threadId);
    expect(thread).toStrictEqual({
      ...expectedThread, comments: expectedComments,
    });
  });
});
