if (process.env.NODE_ENV === 'production') {
	module.exports = require('./RootRoute.prod'); // eslint-disable-line global-require
} else {
	module.exports = require('./RootRoute.dev'); // eslint-disable-line global-require
}
