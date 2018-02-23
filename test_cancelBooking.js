const Server = require('../../src/server');
const Models = require('../../models');
const jwt = require('jsonwebtoken');

jest.setTimeout(10000);
describe('Testing the add user details route', () => {
  beforeAll((done) => {
    Models.bookings.destroy({ truncate: true }).then(() => {
      done();
    });
  });
  afterAll((done) => {
    Models.bookings.destroy({ truncate: true }).then(() => {
      done();
    });
  });
  beforeEach((done) => {
    Models.bookings.bulkCreate([{
      bookingid: '1-2260946',
      email: 'publicUser@hotello.com',
    }]).then(() => {
      done();
    });
  });
  afterEach((done) => {
    Models.bookings.destroy({ truncate: true }).then(() => {
      done();
    });
  });

  it('checking status code for a successfull cancellation', (done) => {
    const authorization = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      email: 'publicUser@hotello.com',
    }, 'RandomSecretString');
    const options = {
      method: 'DELETE',
      url: '/cancelBooking',
      headers: {
        Authorization: authorization,
      },
      payload: {
        bookingid: '1-2260946',
      },
    };
    Server.inject(options, (response) => {
      expect(response.statusCode).toBe(200);
      done();
    });
  });

  it('should return cancellation message after succesfull cancellation', (done) => {
    const authorization = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      email: 'publicUser@hotello.com',
    }, 'RandomSecretString');
    const options = {
      method: 'DELETE',
      url: '/cancelBooking',
      headers: {
        Authorization: authorization,
      },
      payload: {
        bookingid: '1-2260946',
      },
    };
    Server.inject(options, (response) => {
      expect(response.result).toBe('booking cancelled');
      done();
    });
  });

  it('should return error message when trying to cancel with a non-existent bookingid', (done) => {
    const authorization = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      email: 'publicUser@hotello.com',
    }, 'RandomSecretString');
    const options = {
      method: 'DELETE',
      url: '/cancelBooking',
      headers: {
        Authorization: authorization,
      },
      payload: {
        bookingid: '1-2563840',
      },
    };
    Server.inject(options, (response) => {
      expect(response.result).toBe('No booking found with this user');
      done();
    });
  });
});

