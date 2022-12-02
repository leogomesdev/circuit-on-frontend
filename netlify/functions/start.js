const serverless = require("serverless-http");
const { app } = require("./dist/propaganda-scheduler/server/main");

exports.handler = serverless(app());