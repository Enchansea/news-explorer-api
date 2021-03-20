const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.NEWS_KEY = NODE_ENV === 'production' ? JWT_SECRET : 'Fu87sEc53tc0d3';
