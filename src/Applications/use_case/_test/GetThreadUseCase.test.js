const Thread = require('../../../Domains/threads/entities/Thread');
const Comment = require('../../../Domains/comments/entities/Comment');
const Reply = require('../../../Domains/replies/entities/Reply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
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
      username: 'dicoding1',
    });
    const expectedComments = new Comment({
      id: 'comment-123',
      username: 'dicoding2',
      date: '2021-08-08T07:00:00.000Z',
      content: 'A Comment',
    });
    const expectedReplies = new Reply({
      id: 'reply-123',
      content: 'A Reply',
      date: '2021-08-08T07:00:00.000Z',
      username: 'dicoding3',
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve([expectedComments]));
    mockReplyRepository.getReplies = jest.fn()
      .mockImplementation(() => Promise.resolve([expectedReplies]));

    /** creating use case instance */
    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const thread = await getThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getThread)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getComments)
      .toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getReplies)
      .toBeCalledWith(expectedComments.id);

    expect(thread.id).toStrictEqual(expectedThread.id);
    expect(thread.title).toStrictEqual(expectedThread.title);
    expect(thread.body).toStrictEqual(expectedThread.body);
    expect(thread.date).toStrictEqual(expectedThread.date);
    expect(thread.username).toStrictEqual(expectedThread.username);

    expect(thread.comments[0].id).toStrictEqual(expectedComments.id);
    expect(thread.comments[0].username).toStrictEqual(expectedComments.username);
    expect(thread.comments[0].date).toStrictEqual(expectedComments.date);
    expect(thread.comments[0].content).toStrictEqual(expectedComments.content);

    expect(thread.comments[0].replies[0].id).toStrictEqual(expectedReplies.id);
    expect(thread.comments[0].replies[0].username).toStrictEqual(expectedReplies.username);
    expect(thread.comments[0].replies[0].date).toStrictEqual(expectedReplies.date);
    expect(thread.comments[0].replies[0].content).toStrictEqual(expectedReplies.content);
  });
});
