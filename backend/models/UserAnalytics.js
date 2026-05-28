const mongoose = require('mongoose');

const userAnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String },
  email: { type: String },
  firstVisit: { type: Date },
  lastVisit: { type: Date },
  totalVisits: { type: Number, default: 1 },
  pagesViewed: { type: Number, default: 0 },
  matchesWatched: { type: Number, default: 0 },
  planType: { type: String },
  country: { type: String },
  ip: { type: String },
  visitHistory: [
    {
      date: { type: Date },
      pagesViewed: { type: Number },
      matchesWatched: { type: Number }
    }
  ]
});

module.exports = mongoose.model('UserAnalytics', userAnalyticsSchema);
