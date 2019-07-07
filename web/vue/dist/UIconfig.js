// Note: this file gets copied around, make sure you edit
// the UIconfig located at `gekko/web/vue/dist/UIconfig.js`.

// This config is used by both the frontend as well as the web server.
// see https://gekko.wizb.it/docs/installation/installing_gekko_on_a_server.html#Configuring-Gekko

SSL = true;

if(typeof window === 'undefined')
  PORT = process.env.PORT;
else
  PORT = SSL ? 443 : 80;


const CONFIG = {
  headless: true,
  api: {
    host: '0.0.0.0',
    port: PORT,
    timeout: 120000 // 2 minutes
  },
  ui: {
    ssl: SSL,
    host: 'shrouded-escarpment-61081.herokuapp.com',
    port: PORT,
    path: '/'
  },
  adapter: 'sqlite'
}

if(typeof window === 'undefined')
  module.exports = CONFIG;
else
  window.CONFIG = CONFIG;
