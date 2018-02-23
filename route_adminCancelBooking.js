const adminCancelBooking = require('../controllers/adminCancelBooking');

module.exports = [
  {
    method: 'DELETE',
    path: 'adminCancelBooking',
    handler: (request, reply) => {
      const cancelledPromise = adminCancelBooking(request.headers.authorization, request.payload);
      cancelledPromise
        .then(responseObj => reply(responseObj))
        .catch(error => reply(error.message));
    },
    config: {
      auth: 'jwt',
    },
  },
];

