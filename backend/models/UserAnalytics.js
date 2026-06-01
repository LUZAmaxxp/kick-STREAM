const mongoose = require('mongoose');

const userAnalyticsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, maxlength: 100 },
  email: { type: String, maxlength: 200 },
  firstVisit: { type: Date },
  lastVisit: { type: Date },
  totalVisits: { type: Number, default: 1 },
  pagesViewed: { type: Number, default: 0 },
  matchesWatched: { type: Number, default: 0 },
  planType: { type: String, maxlength: 40 },
  country: { type: String, maxlength: 60 },
  ip: { type: String, maxlength: 60 },
  visitHistory: [
    {
      date: { type: Date },
      pagesViewed: { type: Number },
      matchesWatched: { type: Number },
      page: { type: String, maxlength: 200 }
    }
  ]
}, { timestamps: true });

userAnalyticsSchema.index({ email: 1 });
userAnalyticsSchema.index({ userId: 1 });
userAnalyticsSchema.index({ lastVisit: -1 });

module.exports = mongoose.model('UserAnalytics', userAnalyticsSchema);
