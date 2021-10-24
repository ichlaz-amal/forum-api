const Thread = require('../../../Domains/threads/entities/Thread');
const Comment = require('../../../Domains/comments/entities/Comment');
const Comments = require('../../../Domains/comments/entities/Comments');
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
      date: new Date(),
      username: 'dicoding1',
    });
    const expectedComment = new Comment({
      id: 'comment-123',
      username: 'dicoding2',
      date: new Date(),
      content: 'A Comment',
      isdelete: false,
    });
    const expectedReply = new Reply({
      id: 'reply-123',
      comment: expectedComment.id,
      content: 'A Reply',
      date: new Date(),
      username: 'dicoding3',
      isdelete: false,
    });

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    /** mocking needed function */
    mockThreadRepository.getThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getComments = jest.fn()
      .mockImplementation(() => Promise.resolve(new Comments([expectedComment])));
    mockReplyRepository.getReplies = jest.fn()
      .mockImplementation(() => Promise.resolve([expectedReply]));

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
      .toBeCalledWith((new Comments([expectedComment]).ids));

    expect(thread.id).toStrictEqual(expectedThread.id);
    expect(thread.title).toStrictEqual(expectedThread.title);
    expect(thread.body).toStrictEqual(expectedThread.body);
    expect(thread.date).toStrictEqual(expectedThread.date);
    expect(thread.username).toStrictEqual(expectedThread.username);

    expect(thread.comments[0].id).toStrictEqual(expectedComment.id);
    expect(thread.comments[0].username).toStrictEqual(expectedComment.username);
    expect(thread.comments[0].date).toStrictEqual(expectedComment.date);
    expect(thread.comments[0].content).toStrictEqual(expectedComment.content);

    expect(thread.comments[0].replies[0].id).toStrictEqual(expectedReply.id);
    expect(thread.comments[0].replies[0].username).toStrictEqual(expectedReply.username);
    expect(thread.comments[0].replies[0].date).toStrictEqual(expectedReply.date);
    expect(thread.comments[0].replies[0].content).toStrictEqual(expectedReply.content);
  });
});
