const Reply = require('../Reply');

describe('a Reply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      comment: 'comment-123',
      content: 'A Reply',
      date: new Date(),
      username: 'dicoding',
      isdelete: false,
    };

    // Action and Assert
    expect(() => new Reply(payload))
      .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      comment: 'comment-123',
      content: 'A Reply',
      date: new Date(),
      username: 'dicoding',
      isdelete: false,
    };

    // Action and Assert
    expect(() => new Reply(payload))
      .toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create reply object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      comment: 'comment-123',
      content: 'A Reply',
      date: new Date(),
      username: 'dicoding',
      isdelete: false,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual(payload.content);
    expect(reply.date).toEqual(payload.date.toISOString());
    expect(reply.username).toEqual(payload.username);
  });

  it('should create reply object correctly when deleted', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      comment: 'comment-123',
      content: 'A Reply',
      date: new Date(),
      username: 'dicoding',
      isdelete: true,
    };

    // Action
    const reply = new Reply(payload);

    // Assert
    expect(reply.id).toEqual(payload.id);
    expect(reply.content).toEqual('**balasan telah dihapus**');
    expect(reply.date).toEqual(payload.date.toISOString());
    expect(reply.username).toEqual(payload.username);
  });
});
