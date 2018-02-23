const Server = require('../../src/server');
const Models = require('../../models');
const jwt = require('jsonwebtoken');

jest.setTimeout(10000);
describe('Testing the add user details route', () => {
  beforeAll((done) => {
    Models.bookings.destroy({ truncate: true }).then(() => {
      Models.users.destroy({ truncate: true }).then(() => done());
    });
  });
  afterAll((done) => {
    Models.bookings.destroy({ truncate: true }).then(() => {
      Models.users.destroy({ truncate: true }).then(() => done());
    });
  });
  beforeEach((done) => {
    Models.users.bulkCreate([{
      email: 'admin@hotello.com',
      password: 'Hotello@12',
      role: 'admin',
    },
    {
      email: 'publicUser@hotello.com',
      password: 'PublicUser@1234',
      role: 'publicUser',
    }]).then(() => {
      Models.bookings.bulkCreate([{
        bookingid: '1-2260946',
        email: 'publicUser@hotello.com',
      }]).then(() => {
        done();
      });
    });
  });

  afterEach((done) => {
    Models.bookings.destroy({ truncate: true }).then(() => {
      Models.users.destroy({ truncate: true }).then(() => done());
    });
  });

  it('checking status code for a successfull cancellation', (done) => {
    const authorization = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      email: 'admin@hotello.com',
    }, 'RandomSecretString');
    const options = {
      method: 'DELETE',
      url: '/adminCancelBooking',
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
      email: 'admin@hotello.com',
    }, 'RandomSecretString');
    const options = {
      method: 'DELETE',
      url: '/adminCancelBooking',
      headers: {
        Authorization: authorization,
      },
      payload: {
        bookingid: '1-2553840',
      },
    };
    Server.inject(options, (response) => {
      expect(response.result).toBe('booking cancelled');
      done();
    });
  });

  it('should return error message when non-admin tries to cancel', (done) => {
    const authorization = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      email: 'publicUser@hotello.com',
    }, 'RandomSecretString');
    const options = {
      method: 'DELETE',
      url: 'adminCancelBooking/',
      headers: {
        Authorization: authorization,
      },
      payload: {
        bookingid: '1-2553840',
      },
    };
    Server.inject(options, (response) => {
      expect(response.result).toBe('Not admin!');
      done();
    });
  });
});
