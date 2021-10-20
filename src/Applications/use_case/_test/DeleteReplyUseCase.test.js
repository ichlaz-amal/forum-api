const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('DeleteReplyUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      userId: ['user-123'],
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };
    const deleteReplyUseCase = new DeleteReplyUseCase({});

    // Action & Assert
    await expect(deleteReplyUseCase.execute(useCasePayload))
      .rejects.toThrowError('DELETE_REPLY_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the delete reply action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
      replyId: 'reply-123',
    };

    const mockReplyRepository = new ReplyRepository();
    mockReplyRepository.deleteReply = jest.fn()
      .mockImplementation(() => Promise.resolve());

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
    });

    // Action
    await deleteReplyUseCase.execute(useCasePayload);

    // Assert
    expect(mockReplyRepository.deleteReply)
      .toHaveBeenCalledWith(useCasePayload);
  });
});
