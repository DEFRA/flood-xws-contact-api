const routes = [].concat(
  require('../routes/subscribe'),
  require('../routes/unsubscribe')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
