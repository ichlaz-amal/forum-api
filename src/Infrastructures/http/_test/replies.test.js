const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('/replies enpoint', () => {
  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
  });

  describe('when POST /replies', () => {
    it('should response 201 and new reply', async () => {
      // Arrange
      const requestPayload = { content: 'A Reply' };
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'a Thread', body: 'a Body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // add comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'a Comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedReply).toBeDefined();
    });

    it('should response 400 when request payload not contain needed property', async () => {
      // Arrange
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'a Thread', body: 'a Body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // add comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'a Comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: {},
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
        .toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      // Arrange
      const requestPayload = { content: ['A Reply'] };
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'a Thread', body: 'a Body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // add comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'a Comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message)
        .toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
    });

    it('should response 401 when access token not valid', async () => {
      // Arrange
      const requestPayload = { content: 'A Reply' };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/threadId/comments/commentId/replies',
        payload: requestPayload,
        headers: { Authorization: 'Bearer accessToken' },
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 404 when thread not found', async () => {
      // Arrange
      const requestPayload = { content: 'A Reply' };
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/threads/threadId/comments/commentId/replies',
        payload: requestPayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('thread tidak ditemukan');
    });
  });

  describe('when DELETE /replies', () => {
    it('should response 200 when reply id valid', async () => {
      // Arrange
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'a Thread', body: 'a Body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // add comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'a Comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // add reply
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 'A Reply' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedReply: { id: replyId } } } = JSON.parse(replyResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });

    it('should response 401 when access token not valid', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/threads/threadId/comments/commentId/replies/replyId',
        headers: { Authorization: 'Bearer accessToken' },
      });

      // Assert
      expect(response.statusCode).toEqual(401);
    });

    it('should response 403 when user is not reply owner', async () => {
      // Arrange
      const server = await createServer(container);

      // add user 1
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user_satu',
          password: 'secret',
          fullname: 'User Satu',
        },
      });

      // add user 2
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'user_dua',
          password: 'secret',
          fullname: 'User Dua',
        },
      });

      // login user 1
      const loginResponse1 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'user_satu', password: 'secret' },
      });
      const { data: { accessToken: accessToken1 } } = JSON.parse(loginResponse1.payload);

      // login user 2
      const loginResponse2 = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'user_dua', password: 'secret' },
      });
      const { data: { accessToken: accessToken2 } } = JSON.parse(loginResponse2.payload);

      // add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'a Thread', body: 'a Body' },
        headers: { Authorization: `Bearer ${accessToken1}` },
      });
      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // add comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'a Comment' },
        headers: { Authorization: `Bearer ${accessToken1}` },
      });
      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // add reply
      const replyResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments/${commentId}/replies`,
        payload: { content: 'A Reply' },
        headers: { Authorization: `Bearer ${accessToken1}` },
      });
      const { data: { addedReply: { id: replyId } } } = JSON.parse(replyResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
        headers: { Authorization: `Bearer ${accessToken2}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(403);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('user tidak diizinkan mengakses');
    });

    it('should response 404 when reply id not found', async () => {
      // Arrange
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'dicoding',
          password: 'secret',
          fullname: 'Dicoding Indonesia',
        },
      });

      // login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: { username: 'dicoding', password: 'secret' },
      });
      const { data: { accessToken } } = JSON.parse(loginResponse.payload);

      // add thread
      const threadResponse = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: { title: 'a Thread', body: 'a Body' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedThread: { id: threadId } } } = JSON.parse(threadResponse.payload);

      // add comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: { content: 'a Comment' },
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { data: { addedComment: { id: commentId } } } = JSON.parse(commentResponse.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}/replies/replyId`,
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(404);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('balasan tidak ditemukan');
    });
  });
});
