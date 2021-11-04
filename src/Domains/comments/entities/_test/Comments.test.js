const Comment = require('../Comment');
const Comments = require('../Comments');
const Reply = require('../../../replies/entities/Reply');

describe('a Comments entities', () => {
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      date: new Date(),
      content: 'A Comment',
      isdelete: false,
      likecount: 0,
    };

    // Action and Assert
    expect(() => new Comments(payload))
      .toThrowError('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => new Comments([payload]))
      .toThrowError('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comments object correctly', () => {
    // Arrange
    const payload = new Comment({
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A Comment',
      isdelete: false,
      likecount: 0,
    });

    // Action
    const comments = new Comments([payload]);

    // Assert
    expect(comments.data[0].id).toEqual(payload.id);
    expect(comments.data[0].username).toEqual(payload.username);
    expect(comments.data[0].date).toEqual(payload.date);
    expect(comments.data[0].content).toEqual(payload.content);
    expect(comments.data[0].replies).toEqual([]);
  });
});

describe('addReplies of Comment Entities', () => {
  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      comment: 'comment-123',
      date: new Date(),
      content: 'A Reply',
      isdelete: false,
    };
    const comment = new Comment({
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A Comment',
      isdelete: false,
      likecount: 0,
    });
    const comments = new Comments([comment]);

    // Action & Assert
    expect(() => comments.addReplies(payload))
      .toThrowError('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
    expect(() => comments.addReplies([payload]))
      .toThrowError('COMMENTS.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should added replies in comments correctly', () => {
    // Arrange
    const payload = [
      new Reply({
        id: 'reply-123',
        username: 'dicoding',
        comment: 'comment-456',
        date: new Date(),
        content: 'A Reply',
        isdelete: false,
      }),
      new Reply({
        id: 'reply-123',
        username: 'dicoding',
        comment: 'comment-123',
        date: new Date(),
        content: 'A Reply',
        isdelete: false,
      }),
    ];
    const comment = new Comment({
      id: 'comment-123',
      username: 'dicoding',
      date: new Date(),
      content: 'A Comment',
      isdelete: false,
      likecount: 0,
    });
    const comments = new Comments([comment]);

    // Action
    comments.addReplies(payload);

    // Assert
    expect(comments.data[0].replies).toHaveLength(1);
    expect(comments.data[0].replies[0]).toEqual(payload[1]);
  });
});
