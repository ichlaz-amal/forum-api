class RefreshAuthenticationUseCase {
  constructor({ authenticationRepository, authenticationTokenManager }) {
    this._authenticationRepository = authenticationRepository;
    this._authenticationTokenManager = authenticationTokenManager;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);

    const { refreshToken } = useCasePayload;
    await this._authenticationTokenManager.verifyRefreshToken(refreshToken);
    await this._authenticationRepository.checkToken(refreshToken);

    const { id } = await this._authenticationTokenManager.decodePayload(refreshToken);
    return this._authenticationTokenManager.createAccessToken({ id });
  }

  _verifyPayload(payload) {
    const { refreshToken } = payload;
    if (!refreshToken) {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RefreshAuthenticationUseCase;
