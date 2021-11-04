const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads/{thread}/comments',
    handler: handler.postCommentHandler,
    options: { auth: 'forum_jwt' },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: handler.likeCommentHandler,
    options: { auth: 'forum_jwt' },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: handler.deleteCommentHandler,
    options: { auth: 'forum_jwt' },
  },
]);

module.exports = routes;
