const LoginUser = require('../../Domains/users/entities/LoginUser');
const NewAuth = require('../../Domains/authentications/entities/NewAuth');

class LoginUserUseCase {
  constructor({
    userRepository,
    authenticationRepository,
    authenticationTokenManager,
    passwordHash,
  }) {
    this._userRepository = userRepository;
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const { username, password } = new LoginUser(useCasePayload);
    const encryptedPassword = await this._userRepository.getPassword(username);
    await this._passwordHash.compare(password, encryptedPassword);
    const id = await this._userRepository.getUserId(username);

    const accessToken = await this._authenticationTokenManager
      .createAccessToken({ id });
    const refreshToken = await this._authenticationTokenManager
      .createRefreshToken({ id });

    const newAuthentication = new NewAuth({ accessToken, refreshToken });
    await this._authenticationRepository.addToken(newAuthentication.refreshToken);
    return newAuthentication;
  }
}

module.exports = LoginUserUseCase;
