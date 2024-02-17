module.exports = {
    apps : [
        {
          name: "aureblog",
          script: "./server.js",
          env: {
              "PORT": 3001,
              "NODE_ENV": "development",
              "MONGODB_URI": "mongodb://localhost:27017/test",
              "PASSPORT_SECRET": "cats"
          },
        }
    ]
  }
  