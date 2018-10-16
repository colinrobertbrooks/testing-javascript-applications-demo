// arrange
const saltBuffer = Buffer.from([196, 7, 46]);
const hashBuffer = Buffer.from([177, 82, 222]);
const saltString = saltBuffer.toString('base64');
const hashString = hashBuffer.toString('hex');
const validPassword = 'G@@DPwD';
const invalidPassword = 'B@DPwD';

jest.doMock('crypto', () => ({
  // eslint-disable-next-line no-unused-vars
  randomBytes(size) {
    return saltBuffer;
  },
  pbkdf2(password, salt, iterations, keylen, digest, callback) {
    if (password === validPassword) {
      callback(null, hashBuffer);
    } else {
      callback(null, Buffer.from([9999, 9999, 9999]));
    }
  }
}));

const { encrypt, validate } = require('app/helpers/authentication/password');

describe('the encrypt method', () => {
  it('should return salt and hash', async () => {
    // act
    const { hash, salt } = await encrypt(validPassword);

    // assert
    expect(salt).toBe(saltString);
    expect(hash).toBe(hashString);
  });
});

describe('the validate method', () => {
  describe('when password is valid', () => {
    it('should return true', async () => {
      // act
      const isValid = await validate(hashString, saltString, validPassword);

      // assert
      expect(isValid).toBe(true);
    });
  });

  describe('when password is invalid', () => {
    it('should return false', async () => {
      // act
      const isValid = await validate(hashString, saltString, invalidPassword);

      // assert
      expect(isValid).toBe(false);
    });
  });
});
