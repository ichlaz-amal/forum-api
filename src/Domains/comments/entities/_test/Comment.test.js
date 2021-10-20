const Comment = require('../Comment');

describe('a Comment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      username: 'dicoding',
      date: '2021-08-08T07:00:00.000Z',
      content: 'A Comment',
    };

    // Action and Assert
    expect(() => new Comment(payload))
      .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'dicoding',
      date: '2021-08-08T07:00:00.000Z',
      content: 'A Comment',
    };

    // Action and Assert
    expect(() => new Comment(payload))
      .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create comment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'dicoding',
      date: '2021-08-08T07:00:00.000Z',
      content: 'A Comment',
    };

    // Action
    const comment = new Comment(payload);

    // Assert
    expect(comment.id).toEqual(payload.id);
    expect(comment.username).toEqual(payload.username);
    expect(comment.date).toEqual(payload.date);
    expect(comment.content).toEqual(payload.content);
  });
});
