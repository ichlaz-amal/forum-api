const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const Reply = require('../../../Domains/replies/entities/Reply');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('ReplyRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist add reply and return added reply correctly', async () => {
      // Arrange
      const addReply = new AddReply({
        thread: 'thread-123',
        comment: 'comment-123',
        content: 'a Reply',
        owner: 'user-123',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(addReply);

      // Assert
      const replies = await RepliesTableTestHelper.findReplies('reply-123');
      expect(replies).toHaveLength(1);
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: addReply.content,
        owner: addReply.owner,
      }));
    });
  });

  describe('get replies function', () => {
    it('should return replies correctly', async () => {
      // Arrange
      const user = { id: 'user-123', username: 'dicoding' };
      await UsersTableTestHelper.addUser(user);
      const reply = {
        comment: 'comment-123',
        content: 'a Reply',
        owner: user.id,
        date: new Date(),
      };
      await RepliesTableTestHelper.addReply(reply);
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const replies = await replyRepositoryPostgres.getReplies([reply.comment]);

      // Assert
      expect(replies).toStrictEqual([new Reply({
        id: 'reply-123',
        comment: reply.comment,
        username: user.username,
        date: reply.date,
        content: reply.content,
        isdelete: false,
      })]);
    });
  });

  describe('delete reply function', () => {
    it('should throw not found error if reply not found', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
      };
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply(payload))
        .rejects.toThrow(NotFoundError);
    });

    it('should throw authorization error if user is not owner', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
      };
      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
        thread: payload.threadId,
        owner: payload.userId,
      });
      await RepliesTableTestHelper.addReply({
        id: payload.replyId,
        comment: payload.commentId,
        owner: 'user-456',
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action & Assert
      await expect(replyRepositoryPostgres.deleteReply(payload))
        .rejects.toThrow(AuthorizationError);
    });

    it('should delete reply from database', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        threadId: 'thread-123',
        commentId: 'comment-123',
        replyId: 'reply-123',
      };
      await CommentsTableTestHelper.addComment({
        id: payload.commentId,
        thread: payload.threadId,
        owner: payload.userId,
      });
      await RepliesTableTestHelper.addReply({
        id: payload.replyId,
        comment: payload.commentId,
        owner: payload.userId,
      });
      const fakeIdGenerator = () => '123';
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await replyRepositoryPostgres.deleteReply(payload);

      // Assert
      const reply = await RepliesTableTestHelper.findReplies('reply-123');
      expect(reply[0].is_delete).toStrictEqual(true);
    });
  });
});
