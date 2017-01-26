const Yelp = require('yelp');
const yelpApi = new Yelp({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET,
});

const { findOrCreateBusiness, isAttendingBusiness, attendBusiness, unattendBusiness } = require('../businessStorage');
const { LocalEvent } = require('../schemas');

module.exports = app => {
  app.get('/api/find/:locationQuery', (req, res) => {
    getLocationResults(req)
      .then(
        businesses => res.json({
          businesses
        }),
        error => catchError(error, res)
      );
  });

  app.post('/api/attend/:id', (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        status: 401,
        message: 'You have to be logged in to attend a business'
      });
      return;
    }

    attendBusiness(req.params.id, req.user._id);

    res.json({
      status: 200
    });
  });

  app.post('/api/unattend/:id', (req, res) => {
    if (!req.isAuthenticated()) {
      res.status(401).json({
        status: 401,
        message: 'You have to be logged in to unattend a business'
      });
      return;
    }

    unattendBusiness(req.params.id, req.user._id);

    res.json({
      status: 200
    });
  });
};

function getLocationResults(request) {
  return new Promise((resolve, reject) => {
    yelpApi
      .search({ category_filter: 'bars', location: request.params.locationQuery})
      .then(data => data.businesses)
      .then(businesses => {
        if (!businesses) {
          return [];
        } else {
          return businesses.map((business, index) => {
            const cachedBusiness = findOrCreateBusiness(business.id);

            // Categories are as arrays in result, we simplify things
            const categories = business.categories
              ? business.categories.map(category => category[0])
              : [];

            const userIsAttending = request.isAuthenticated()
              ? isAttendingBusiness(cachedBusiness, request.user._id)
              : false;

            // If the current user is attending, we remove one from the total count,
            // so we can deal with it client side.
            const attendeeCount = cachedBusiness.attendees.length
              + (userIsAttending ? -1 : 0);

            return {
              rating: business.rating,
              name: business.name,
              url: business.url,
              categories: categories,
              image: business.image_url,
              snippet: business.snippet_text,
              phone: business.display_phone,
              id: business.id,
              open: !business.is_closed,
              attendeeCount: attendeeCount,
              userIsAttending: userIsAttending
            };
          })
        }
      })
      .then(businesses => resolve(businesses))
      .catch(error => reject(error))
  });
}

function catchError(err, res) {
  console.log(err);
  res.status(500).send();
}
