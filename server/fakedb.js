
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/fake', { useNewUrlParser: true });

const reviewsSchema = mongoose.Schema({
  uuid: Number,
  reviews: [{
    customerName: String,
    starRating: Number,
    date: String,
    reviewTitle: String,
    review: String,
    helpful: { yes: Number, no: Number },
  }],
});


const Review = mongoose.model('Review', reviewsSchema);

const getReviewsByUuid = (uuid, callback) => {
  Review.find({ _id: uuid }, (err, result) => {
    if (err) {
      console.log(err);
      throw err;
    } else {
      console.log('Holy cow!  Your database is sending something to your server!');
      callback(null, result);
    }
  });
};

module.exports = { getReviewsByUuid };
