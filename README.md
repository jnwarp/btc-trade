# btc-trade

The goal of this site is to provide an interface to create and test cryptocurrency trading bots. Eventually it will be connected to services such as Coinbase and BitStamp for realtime trading.

## Frameworks

### Back-end

- [Sails](http://sailsjs.org)
  - Sails provides a framework for creating [Node.js](https://nodejs.org/en/) applications

### Front-end

- [jQuery](https://jquery.com/)
- [Bootstrap v4.0 Beta](http://getbootstrap.com/)
  - Bootstrap is a framework for creating mobile-friendly responsive sites
- [Bootstrap Notify](http://bootstrap-notify.remabledesigns.com/)
  - Bootstrap Notify is a JS library for showing pop-up notifications

## Getting Started

Use `sails lift` to start the localhost server.

### Important configuration files

###### /config/connections.js
```js
module.exports.connections = {
  localMySQL: {
    adapter: 'sails-mysql',
    host: 'localhost',
    user: 'btc-sails',
    password: '',
    database: 'btc-trade'
  }
}
```

###### /config/routes.js
```js
module.exports.routes = {
  '/': {
    view: 'homepage'
  },
  '/test': {
    view: 'test'
  },
  '/login': {
    view: 'login'
  }
}
```
