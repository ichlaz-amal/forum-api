const NewAuth = require('../../../Domains/authentications/entities/NewAuth');
const UserRepository = require('../../../Domains/users/UserRepository');
const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const PasswordHash = require('../../security/PasswordHash');
const LoginUserUseCase = require('../LoginUserUseCase');

describe('LoginUserUseCase', () => {
  it('should orchestrating the login user action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'dicoding',
      password: 'secret',
    };
    const expectedAuthentication = new NewAuth({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    const mockUserRepository = new UserRepository();
    const mockAuthenticationRepository = new AuthenticationRepository();
    const mockAuthenticationTokenManager = new AuthenticationTokenManager();
    const mockPasswordHash = new PasswordHash();

    // Mocking
    mockUserRepository.getPassword = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockPasswordHash.compare = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockUserRepository.getUserId = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockAuthenticationTokenManager.createAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.accessToken));
    mockAuthenticationTokenManager.createRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedAuthentication.refreshToken));
    mockAuthenticationRepository.addToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    // create use case instance
    const loginUserUseCase = new LoginUserUseCase({
      userRepository: mockUserRepository,
      authenticationRepository: mockAuthenticationRepository,
      authenticationTokenManager: mockAuthenticationTokenManager,
      passwordHash: mockPasswordHash,
    });

    // Action
    const actualAuthentication = await loginUserUseCase.execute(useCasePayload);

    // Assert
    expect(mockUserRepository.getPassword)
      .toBeCalledWith('dicoding');
    expect(mockPasswordHash.compare)
      .toBeCalledWith('secret', 'encrypted_password');
    expect(mockUserRepository.getUserId)
      .toBeCalledWith('dicoding');
    expect(mockAuthenticationTokenManager.createAccessToken)
      .toBeCalledWith({ id: 'user-123' });
    expect(mockAuthenticationTokenManager.createRefreshToken)
      .toBeCalledWith({ id: 'user-123' });
    expect(mockAuthenticationRepository.addToken)
      .toBeCalledWith(expectedAuthentication.refreshToken);
    expect(actualAuthentication).toEqual(expectedAuthentication);
  });
});
