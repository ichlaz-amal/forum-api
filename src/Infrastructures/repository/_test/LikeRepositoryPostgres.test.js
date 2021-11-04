const pool = require('../../database/postgres/pool');
const LikesTableTestHelper = require('../../../../tests/LikesTableTestHelper');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres', () => {
  afterEach(async () => {
    await LikesTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('updateLike Function', () => {
    it('should insert new like when like not exists', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      };
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.updateLike(payload);

      // Assert
      const likes = await LikesTableTestHelper.findLike(payload);
      expect(likes).toHaveLength(1);
      expect(likes[0]).toStrictEqual({
        owner: payload.userId,
        comment: payload.commentId,
        liked: true,
      });
    });

    it('should update like if like is exist', async () => {
      // Arrange
      const payload = {
        userId: 'user-123',
        commentId: 'comment-123',
      };
      await LikesTableTestHelper.addLike(payload);
      const likeRepositoryPostgres = new LikeRepositoryPostgres(pool);

      // Action
      await likeRepositoryPostgres.updateLike(payload);

      // Assert
      const likes = await LikesTableTestHelper.findLike(payload);
      expect(likes).toHaveLength(1);
      expect(likes[0]).toStrictEqual({
        owner: payload.userId,
        comment: payload.commentId,
        liked: false,
      });
    });
  });
});
