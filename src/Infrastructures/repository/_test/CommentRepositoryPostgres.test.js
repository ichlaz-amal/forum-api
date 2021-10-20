const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddComment = require('../../../Domains/comments/entities/AddComment');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const Comment = require('../../../Domains/comments/entities/Comment');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist add comment and return added comment correctly', async () => {
      // Arrange
      const addComment = new AddComment({
        thread: 'thread-123',
        content: 'a Comment',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(addComment);

      // Assert
      const comments = await CommentsTableTestHelper.findComments('comment-123');
      expect(comments).toHaveLength(1);
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: addComment.content,
        owner: addComment.owner,
      }));
    });
  });

  describe('check comment function', () => {
    it('should throw not found error if comment not found', async () => {
      // Arrange
      const commentId = 'comment-123';
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.checkComment(commentId))
        .rejects.toThrow(NotFoundError);
    });

    it('should not throw any error if comment found and user is owner', async () => {
      // Arrange
      const commentId = 'comment-123';
      await CommentsTableTestHelper.addComment({ id: commentId });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.checkComment(commentId))
        .resolves.not.toThrow(NotFoundError);
    });
  });

  describe('get comments function', () => {
    it('should return comments correctly', async () => {
      // Arrange
      const user = { id: 'user-123', username: 'dicoding' };
      await UsersTableTestHelper.addUser(user);
      const comment = {
        thread: 'thread-123',
        content: 'a Comment',
        owner: user.id,
        date: (new Date()).toISOString(),
      };
      await CommentsTableTestHelper.addComment(comment);
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const comments = await commentRepositoryPostgres.getComments(comment.thread);

      // Assert
      expect(comments).toStrictEqual([new Comment({
        id: 'comment-123',
        username: user.username,
        date: comment.date,
        content: comment.content,
      })]);
    });
  });

  describe('delete comment function', () => {
    it('should throw not found error if comment not found', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment(payload))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw authorization error if user is not owner', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
      };
      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
        thread: payload.threadId,
        owner: 'user-456',
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(commentRepositoryPostgres.deleteComment(payload))
        .rejects.toThrow(AuthorizationError);
    });

    it('should delete comment from database', async () => {
      // Arrange
      const payload = { userId: 'user-123', threadId: 'thread-123', commentId: 'comment-123' };
      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
        thread: payload.threadId,
        owner: payload.userId,
      });
      const fakeIdGenerator = () => '123';
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await commentRepositoryPostgres.deleteComment(payload);

      // Assert
      const comment = await CommentsTableTestHelper.findComments(payload.commentId);
      expect(comment[0].is_delete).toStrictEqual(true);
    });
  });
});
