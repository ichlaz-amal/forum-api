const AddReply = require('../AddReply');

describe('a AddReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      comment: 'comment-123',
      content: 'A Reply',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddReply(payload))
      .toThrowError('ADD_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      thread: 123,
      comment: 'comment-123',
      content: 'A Reply',
      owner: 'user-123',
    };

    // Action and Assert
    expect(() => new AddReply(payload))
      .toThrowError('ADD_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addReply object correctly', () => {
    // Arrange
    const payload = {
      thread: 'thread-123',
      comment: 'comment-123',
      content: 'A Reply',
      owner: 'user-123',
    };

    // Action
    const addReply = new AddReply(payload);

    // Assert
    expect(addReply.thread).toEqual(payload.thread);
    expect(addReply.comment).toEqual(payload.comment);
    expect(addReply.content).toEqual(payload.content);
    expect(addReply.owner).toEqual(payload.owner);
  });
});
