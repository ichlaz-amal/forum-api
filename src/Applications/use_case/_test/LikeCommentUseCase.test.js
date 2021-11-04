const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeCommentUseCase = require('../LikeCommentUseCase');

describe('LikeCommentUseCase', () => {
  it('should throw error if use case payload not contain needed property', async () => {
    // Arrange
    const useCasePayload = {};
    const likeCommentUseCase = new LikeCommentUseCase({});

    // Action & Assert
    await expect(likeCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('LIKE_COMMENT_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    // Arrange
    const useCasePayload = {
      userId: ['user-123'],
      threadId: 'thread-123',
      commentId: 'comment-123',
    };
    const likeCommentUseCase = new LikeCommentUseCase({});

    // Action & Assert
    await expect(likeCommentUseCase.execute(useCasePayload))
      .rejects.toThrowError('LIKE_COMMENT_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating the like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      userId: 'user-123',
      threadId: 'thread-123',
      commentId: 'comment-123',
    };

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockLikeRepository = new LikeRepository();

    mockThreadRepository.checkThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkComment = jest.fn(() => Promise.resolve());
    mockLikeRepository.updateLike = jest.fn(() => Promise.resolve());

    const likeCommentUseCase = new LikeCommentUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.checkThread)
      .toHaveBeenCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.checkComment)
      .toHaveBeenCalledWith(useCasePayload.commentId);
    expect(mockLikeRepository.updateLike)
      .toHaveBeenCalledWith({
        userId: useCasePayload.userId,
        commentId: useCasePayload.commentId,
      });
  });
});
