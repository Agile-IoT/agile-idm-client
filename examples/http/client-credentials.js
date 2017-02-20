var Client = require('../../index').httpClient;
var conf = require('./conf_example');

console.log(JSON.stringify(conf));
var client = new Client(conf);
client.authenticateClient("MyAgileClient2", "Ultrasecretstuff").then(function (result) {
  console.log("authentication successful: " + JSON.stringify(result));
  return Promise.all([client.getUserInfo(result.access_token), client.getClientInfo(result.access_token)]);
}).then(function (infos) {
  console.log("user info obtained : " + JSON.stringify(infos[0]));
  console.log("client info obtained : " + JSON.stringify(infos[1]));
}).catch(function (error) {
  console.log("error:" + error)
});
