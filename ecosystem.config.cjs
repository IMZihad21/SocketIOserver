module.exports = {
  apps: [ {
    name: "socketio",
    script: "./server.js",
    instances: "1",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  } ]
}