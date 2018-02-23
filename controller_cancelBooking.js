const fetch = require('node-fetch');
const JWT = require('jsonwebtoken');
const Models = require('../../models');
const xSigGenerator = require('../helpers/xSignatureGenerator');

function cancelBooking(token, payload) {
  const decodedToken = JWT.decode(token, 'RandomSecretString');
  const { bookingid } = payload;
  const apiUrl = 'https://api.hotelbeds.com/hotel-api/1.0/bookings';
  const reqUrl = `${apiUrl}/${bookingid}/cancellationFlag=SIMULATION&language=ENG`;
  const apiKey = 't6j676c82cc6n58hg6ysur3c';
  const xSignature = xSigGenerator();
  const requestConfig = {
    headers: {
      'Api-key': apiKey,
      'X-Signature': xSignature,
      Accept: 'application/json',
      'Accept-Encoding': 'gzip',
    },
  };
  const promise = new Promise((resolve, reject) => {
    Models.bookings.find({
      where: {
        email: decodedToken.email,
        bookingid,
      },
    }).then(() => {
      fetch(reqUrl, requestConfig)
        .then(response => response.json())
        .then((respJson) => {
          if (respJson.booking.status === 'CANCELLED') {
            Models.bookings.destroy({
              where: {
                bookingid,
              },
            }).then((record) => {
              resolve({ bookingDetails: record, msg: 'booking cancelled' });
            });
          } else {
            reject(Error('Not cancelled, try again'));
          }
        })
        .catch(() => reject(Error('Error in fetching')));
    }).catch(() => reject(Error('No booking found with this user')));
  });
  return promise;
}

module.exports = cancelBooking;

