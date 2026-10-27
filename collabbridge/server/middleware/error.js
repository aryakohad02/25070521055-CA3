// Centralized error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging in development
  console.error(`[API Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id: ${err.value}`;
    return res.status(404).json({ success: false, message });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    let field = Object.keys(err.keyValue || {})[0];
    let message = 'Duplicate field value entered.';
    if (field === 'email') {
      message = 'An account with this email address already exists.';
    } else if (err.keyPattern && err.keyPattern.campaignId && err.keyPattern.influencerId) {
      message = 'You have already submitted an application for this campaign.';
    } else if (err.keyPattern && err.keyPattern.campaignId && err.keyPattern.reviewerId) {
      message = 'You have already submitted a review for this collaboration.';
    }
    return res.status(400).json({ success: false, message });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    return res.status(400).json({ success: false, message });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ success: false, message: 'Invalid authentication token.' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, message: 'Authentication token has expired.' });
  }

  // Default server error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Internal Error'
  });
};

module.exports = errorHandler;
